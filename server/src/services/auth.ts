import jwt from 'jsonwebtoken';
import { Request } from 'express';
import dotenv from 'dotenv';

dotenv.config();

// Define interfaces for better type safety
interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

interface AuthContext {
  user?: JwtPayload | null;
}

// Get secret key from environment variables
const secretKey = process.env.JWT_SECRET_KEY || 'fallback_secret_key';

// Updated for GraphQL context
export const authMiddleware = async ({ req }: { req: Request }): Promise<AuthContext> => {
  // Get token from headers
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return { user: null };
  }

  try {
    const token = authHeader.split(' ')[1];
    const user = jwt.verify(token, secretKey) as JwtPayload;
    return { user };
  } catch (err) {
    console.error('Invalid token:', err);
    return { user: null };
  }
};

export const signToken = (username: string, email: string, _id: unknown): string => {
  const payload: JwtPayload = { username, email, _id };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};