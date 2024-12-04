import jwt from 'jsonwebtoken';
import { ExpressContext } from '@apollo/server/express4';
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
export const authMiddleware = async ({ req }: ExpressContext): Promise<AuthContext> => {
  // Get token from headers
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return { user: null };
  }

  try {
    // Get the token from Bearer token
    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const user = jwt.verify(token, secretKey) as JwtPayload;
    
    return { user };
  } catch (err) {
    console.error('Invalid token:', err);
    return { user: null };
  }
};

// Token signing remains similar but with explicit types
export const signToken = (username: string, email: string, _id: unknown): string => {
  const payload: JwtPayload = { username, email, _id };

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

// Optional: Add a function to verify token without Express context
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, secretKey) as JwtPayload;
  } catch {
    return null;
  }
};