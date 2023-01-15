import { Application } from 'express';

import HomeRoutes from './home';
import AuthRoutes from './auth';
import AppointmentsRoutes from './appointments';
import NotificationsRoutes from './notification';
import AppError from '../errors';
import { errorHandler } from '../middlewares/handle-error';

export default class Routes {
  public homeRoutes = new HomeRoutes();
  public appointmentsRoutes = new AppointmentsRoutes();
  public authRoutes = new AuthRoutes();
  public notificationRoutes = new NotificationsRoutes();

  constructor(app: Application) {
    app.use(errorHandler);

    this.homeRoutes.routes(app);
    this.appointmentsRoutes.routes(app);
    this.authRoutes.routes(app);
    this.notificationRoutes.routes(app);

    app.all('*', () => {
      throw new AppError(404, 'Route not found');
    });
  }
}
