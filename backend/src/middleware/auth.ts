import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tumpanich-secret-key-change-in-production';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

/**
 * Middleware to verify JWT token for protected routes
 */
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'ต้องเข้าสู่ระบบก่อน' });
  }

  const token = authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token ไม่ถูกต้อง' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      username: string;
      role: string;
    };
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token หมดอายุหรือไม่ถูกต้อง' });
  }
};

/**
 * Generate JWT token
 */
export const generateToken = (user: { id: number; username: string; role: string }): string => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Optional: Role-based access control
 */
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'ต้องเข้าสู่ระบบก่อน' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'ไม่มีสิทธิ์เข้าถึง' });
    }

    next();
  };
};
