import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { apiResponse } from '../utils/apiResponse.js';

export const validateMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const mappedErrors = errors.array().map((error) => ({
      field: ('param' in error ? error.param : 'unknown') as string,
      message: error.msg,
    }));

    res.status(400).json(apiResponse.error('Validation failed', mappedErrors));
    return;
  }

  next();
};
