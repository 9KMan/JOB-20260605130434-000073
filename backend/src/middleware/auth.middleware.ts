import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../lib/config';
import { HttpError } from './error.middleware';

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  tenantId?: string;
}

export interface AuthedRequest extends Request {
  user?: AuthUser;
}

export function authMiddleware(req: AuthedRequest, _res: Response, next: NextFunction): void {
  const header = req.header('authorization') || req.header('Authorization');
  if (!header || !header.toLowerCase().startsWith('bearer ')) {
    return next(new HttpError(401, 'UNAUTHORIZED', 'Missing bearer token'));
  }
  const token = header.slice(7).trim();
  try {
    const payload = jwt.verify(token, config.jwtSecret) as AuthUser & { iat: number; exp: number };
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      tenantId: payload.tenantId
    };
    next();
  } catch {
    next(new HttpError(401, 'UNAUTHORIZED', 'Invalid or expired token'));
  }
}

export function requireRole(...roles: AuthUser['role'][]) {
  return (req: AuthedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new HttpError(401, 'UNAUTHORIZED', 'Not authenticated'));
    if (!roles.includes(req.user.role)) {
      return next(new HttpError(403, 'FORBIDDEN', 'Insufficient permissions'));
    }
    next();
  };
}
