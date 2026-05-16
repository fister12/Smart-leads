import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { apiResponse } from '../utils/apiResponse.js';

export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json(apiResponse.error(err.message));
    return;
  }

  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json(apiResponse.error('Invalid JSON format'));
    return;
  }

  res.status(500).json(apiResponse.error('Internal server error'));
};
