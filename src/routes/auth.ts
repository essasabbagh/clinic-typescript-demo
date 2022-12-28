// import { Router } from 'express';
import { Application } from 'express';

import { errorHandler } from '../middlewares/handle-error';

import AuthController from '../controllers/authController';

export class Auth {
  public routes(app: Application): void {
    //received the express instance from app.ts file

    app.use(errorHandler);

    app.post('/social', AuthController.verifyIdToken, AuthController.social);

    app.post('/signup', AuthController.register);

    app.post('/login', AuthController.login);

    app.post('/validate', AuthController.validate);

    app.get('/profile', AuthController.verifyToken, AuthController.profile);
  }
}
