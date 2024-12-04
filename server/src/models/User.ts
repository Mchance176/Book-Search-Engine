import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

// Define the interface for User document
interface IUser {
  username: string;
  email: string;
  password: string;
  savedBooks: Array<{
    bookId: string;
    authors: string[];
    description: string;
    title: string;
    image: string;
    link: string;
  }>;
  isCorrectPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must use a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  savedBooks: [{
    bookId: {
      type: String,
      required: true,
    },
    authors: [String],
    description: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    link: {
      type: String,
    },
  }],
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Custom method to compare and validate password
userSchema.methods.isCorrectPassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User = model<IUser>('User', userSchema);

export default User;