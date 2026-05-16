import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { UserRole } from '../types/user.types.js';

export const roleMiddleware = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('User not authenticated', 401));
      return;
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      next(new AppError('Access denied', 403));
      return;
    }

    next();
  };
};

export const adminOnly = roleMiddleware(['admin']);
export const salesUserOnly = roleMiddleware(['salesUser', 'admin']);
