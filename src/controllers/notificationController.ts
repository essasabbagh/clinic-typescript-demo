import { Request, Response, NextFunction } from 'express';
import NotificationService from '../services/notificationService';
import AppError from '../errors';
import Logger from '../middlewares/logs/logger';

export default class NotificationController {
  static async pushNotification(req: Request, res: Response, next: NextFunction) {
    NotificationService.send(req)
      .then(messageResponse => {
        return res.status(201).json({
          success: true,
          data: messageResponse,
        });
      })
      .catch(err => next(err));
  }
  static async sendToDevice(req: Request, res: Response, next: NextFunction) {
    NotificationService.sendToDevice(req)
      .then(messageResponse => {
        if (messageResponse.failureCount > 0) {
          Logger.error(messageResponse);
          throw new AppError(
            400,
            messageResponse.results.map(i => {
              return i.error?.message ?? '';
            })[0]
          );
        }
        return res.status(201).json({
          success: true,
          data: messageResponse,
        });
      })
      .catch(err => next(err));
  }
}
