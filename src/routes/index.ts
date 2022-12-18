import express = require('express');
import { Home } from './home';
import { Auth } from './auth';
import { Appointments } from './appointments';
import { AppError } from '../errors';

export class Routes {
  public homeRoutes: Home = new Home();
  public appointmentsRoutes: Appointments = new Appointments();
  public authRoutes: Auth = new Auth();

  constructor(app: express.Application) {
    this.homeRoutes.routes(app);
    this.appointmentsRoutes.routes(app);
    this.authRoutes.routes(app);

    app.all('*', () => {
      throw new AppError(404, 'Route not found');
    });
  }
}
