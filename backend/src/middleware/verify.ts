import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from '../utils/interfaces.js';

const JWT_SECRET = process.env.JWT_SECRET as string;


export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};