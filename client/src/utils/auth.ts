import jwt from 'jsonwebtoken';
import { Request } from 'express';
import dotenv from 'dotenv';

dotenv.config();

// Ensure JWT_SECRET is available
const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error('JWT_SECRET must be defined in environment variables');
}

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

interface AuthContext {
  user?: JwtPayload | null;
}

export const authMiddleware = async ({ req }: { req: Request }): Promise<AuthContext> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return { user: null };
  }

  try {
    const token = authHeader.split(' ')[1];
    const user = jwt.verify(token, secret) as JwtPayload;
    return { user };
  } catch (err) {
    console.error('Invalid token:', err);
    return { user: null };
  }
};

export const signToken = (username: string, email: string, _id: unknown): string => {
  const payload: JwtPayload = { username, email, _id };
  return jwt.sign(payload, secret, { expiresIn: '2h' });
};