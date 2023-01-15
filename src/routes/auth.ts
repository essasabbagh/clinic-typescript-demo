import { Application } from 'express';
// import { Request, Response, NextFunction, Application } from 'express';

import AuthController from '../controllers/authController';
import ErrorController from '../controllers/errorController';

export default class AuthRoutes {
  public routes(app: Application): void {
    app
      .post('/social', AuthController.verifyIdToken, AuthController.social)
      .get('/social', ErrorController.notAllowedMethod)

      .post('/signup', AuthController.register)

      .post('/login', AuthController.login)

      .post('/validate', AuthController.validate)

      .get('/profile', AuthController.verifyToken, AuthController.profile);
  }
}
