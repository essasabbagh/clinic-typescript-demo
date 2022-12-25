import { Request, Response, NextFunction } from 'express';
import Logger from './logs/logger';
import AppError from '../errors';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  Logger.error(err.message);
  if (err instanceof AppError) {
    return res.status(err.status).send({
      success: false,
      message: err.message,
    });
  } else {
    return res.status(400).send({
      success: false,
      message: 'Something went wrong ' + err,
    });
  }
};
