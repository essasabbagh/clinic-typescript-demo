import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ errors: err.message });
  }
  res.status(400).send({
    errors: [{ message: 'Something went wrong' }],
  });
};
