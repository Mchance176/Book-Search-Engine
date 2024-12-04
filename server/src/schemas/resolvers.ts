import { AuthenticationError } from '@apollo/server';
import { User } from '../models';
import { signToken } from '../services/auth';
import type { Context } from '../types/context';  // We'll create this type

const resolvers = {
  Query: {
    // Get the logged in user
    me: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      
      const user = await User.findOne({ _id: context.user._id });
      if (!user) {
        throw new AuthenticationError('User not found');
      }
      
      return user;
    },
  },

  Mutation: {
    // Create new user
    addUser: async (_: any, { username, email, password }: { username: string; email: string; password: string }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    // Login user
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    // Save book to user's list
    saveBook: async (_: any, { bookData }: any, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      try {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: bookData } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        throw new Error('Error saving book');
      }
    },

    // Remove book from user's list
    removeBook: async (_: any, { bookId }: { bookId: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error('User not found');
      }

      return updatedUser;
    },
  },
};

export default resolvers;