import { Application } from 'express';
import NotificationController from '../controllers/notificationController';

export default class NotificationsRoutes {
  public routes(app: Application): void {
    app.post('/firebase/notification', NotificationController.pushNotification);
  }
}
