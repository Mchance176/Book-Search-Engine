import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';

// Interfaces for better type safety
interface Context {
  user?: {
    _id: string;
    username: string;
    email: string;
  } | null;
}

interface Book {
  bookId: string;
  authors?: string[];
  description?: string;
  title: string;
  image?: string;
  link?: string;
}

interface BookInput {
  bookData: Book;
}

interface UserInput {
  username: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface UserDocument {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  isCorrectPassword(password: string): Promise<boolean>;
}

const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated');
      }
      
      const user = await User.findOne({ _id: context.user._id });
      if (!user) {
        throw new GraphQLError('User not found');
      }
      
      return user;
    },
  },

  Mutation: {
    addUser: async (_: unknown, { username, email, password }: UserInput) => {
      const user = await User.create({ username, email, password });
      const token = signToken({ 
        username: user.username, 
        email: user.email, 
        _id: user._id 
      });
      return { token, user };
    },
  
    login: async (_: unknown, { email, password }: LoginInput) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new GraphQLError('User not found');
      }
  
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new GraphQLError('Incorrect credentials');
      }
  
      const token = signToken({ 
        username: user.username, 
        email: user.email, 
        _id: user._id 
      });
      return { token, user };
    },
  },

    saveBook: async (_: unknown, { bookData }: BookInput, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated');
      }

      try {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: bookData } },
          { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
          throw new GraphQLError('User not found');
        }
        
        return updatedUser;
      } catch (err) {
        throw new GraphQLError('Error saving book');
      }
    },

    removeBook: async (_: unknown, { bookId }: { bookId: string }, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated');
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );

      if (!updatedUser) {
        throw new GraphQLError('User not found');
      }

      return updatedUser;
    },
  },
};

export default resolvers;