import { Request, Response, Application } from 'express';
import { Role } from '@prisma/client';
import can from '../middlewares/userRole';

import appointments from '../db.json'; //load our local database file
import AppError from '../errors';

export default class AppointmentsRoutes {
  public routes(app: Application): void {
    app
      .get('/appointments', can(Role.ADMIN), (req: Request, res: Response) => {
        res.status(200).json(appointments);
      })

      .get('/appointments/:id', (req: Request, res: Response) => {
        let id: number = +req.params.id;
        if (id <= 0 || id > appointments.length) throw new AppError(404, 'There is no appointments');
        res.status(200).json(appointments[id - 1]);
      });
  }
}
