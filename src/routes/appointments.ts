import { Request, Response, Application } from 'express';
import can from '../middlewares/userRole';

import appointments = require('../db.json'); //load our local database file
import { Role } from '@prisma/client';

export class Appointments {
  public routes(app: Application): void {
    //received the express instance from app.ts file

    app.get('/appointments', can(Role.ADMIN), (req: Request, res: Response) => {
      res.status(200).json(appointments);
    });

    app.get('/appointments/:id', (req: Request, res: Response) => {
      let id: number = +req.params.id;
      res.status(200).json(appointments[id]);
    });
  }
}
