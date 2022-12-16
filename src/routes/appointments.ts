import { Request, Response, Application } from 'express';

import appointments = require('../db.json'); //load our local database file

export class Appointments {
  public routes(app: Application): void {
    //received the express instance from app.ts file

    app.route('/appointments').get((req: Request, res: Response) => {
      res.status(200).json(appointments);
    });

    app.route('/appointments/:id').get((req: Request, res: Response) => {
      let id: number = +req.params.id;
      res.status(200).json(appointments[id]);
    });
  }
}
