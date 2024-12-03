import { AuthenticationError } from 'apollo-server-express';
import { User } from '../models';
import { signToken } from '../services/auth';
import { Context } from '../types/express';

const resolvers = {
  Query: {
    // Get the logged in user
    me: async (_: any, __: any, context: Context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {
    // Login user
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },

    // Create new user
    addUser: async (_: any, args: { username: string; email: string; password: string }) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },

    // Save a book to user's list
    saveBook: async (_: any, { bookData }: any, context: Context) => {
      if (context.user) {
        return User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: bookData } },
          { new: true, runValidators: true }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    // Remove a book from user's list
    removeBook: async (_: any, { bookId }: { bookId: string }, context: Context) => {
      if (context.user) {
        return User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

export default resolvers; 