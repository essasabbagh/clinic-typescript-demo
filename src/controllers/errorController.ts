import { Request, Response, NextFunction } from 'express';
import AppError from '../errors';

export default class ErrorController {
  /**
   * 405 Method Not Allowe d response status code indicates that the server knows the request method,
   * but the target resource doesn't support this method.
   */
  static async notAllowedMethod(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      throw new AppError(405, 'server knows the request method');
    } catch (error) {
      next(error);
    }
  }
}
