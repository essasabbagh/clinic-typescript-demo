import { Request, Response, NextFunction, Application } from 'express';
import Logger from '../middlewares/logs/logger';

export default class HomeRoutes {
  public routes(app: Application): void {
    //received the express instance from app.ts file

    app
      .get('/', (req: Request, res: Response, next: NextFunction) => {
        try {
          res.json({
            success: true,
            message: 'Hello Root router Api',
          });
          // throw 'Hello World Error';
        } catch (error) {
          next(error);
        }
      })

      .get('/home', (req: Request, res: Response) => {
        res.json({
          success: true,
          message: 'Hello Home router Api',
        });
      })

      .get('/logger', (_, res) => {
        Logger.error('This is an error log');
        Logger.warn('This is a warn log');
        Logger.info('This is a info log');
        Logger.http('This is a http log');
        Logger.debug('This is a debug log');

        res.json({ Message: 'Hello world' });
      });
  }
}
