import { Request, Response, NextFunction, Application } from 'express';

export class Home {
  public routes(app: Application): void {
    //received the express instance from app.ts file

    app.get('/', (req: Request, res: Response, next: NextFunction) => {
      try {
        // res.send('Hello World');
        throw 'Hello World Error';
      } catch (error) {
        next(error);
      }
    });

    app.get('/home', (req: Request, res: Response) => {
      res.json({
        success: true,
        message: 'Hello Home router Api',
      });
    });
  }
}
