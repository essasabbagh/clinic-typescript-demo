// import { Router } from 'express';
import { Application } from 'express';

import { errorHandler } from '../middlewares/handle-error';

import AuthService from '../controllers/authService';

export class Auth {
  public routes(app: Application): void {
    //received the express instance from app.ts file

    app.use(errorHandler);

    app.post('/social', AuthService.verifyIdToken, AuthService.social);

    app.post('/signup', AuthService.register);

    app.post('/login', AuthService.login);

    app.post('/validate', AuthService.verifyToken, AuthService.validate);

    app.get('/profile', AuthService.verifyToken, AuthService.profile);
  }
}
