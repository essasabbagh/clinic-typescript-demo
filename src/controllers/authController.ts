import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/authService';

export default class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    AuthService.register(req)
      .then(user =>
        res.status(201).json({
          success: true,
          message: 'User Created Successfully',
          data: user,
        })
      )
      .catch(err => next(err));
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    AuthService.login(req)
      .then(user =>
        res.status(200).json({
          success: true,
          message: 'User Logged Successfully',
          data: user,
        })
      )
      .catch(err => next(err));
  }

  static async social(req: Request, res: Response, next: NextFunction) {
    AuthService.social(req)
      .then(user =>
        res.status(200).json({
          success: true,
          message: 'User Logged Successfully',
          data: user,
        })
      )
      .catch(err => next(err));
  }

  static async validate(req: Request, res: Response, next: NextFunction) {
    AuthService.verifyToken(req)
      .then(_ =>
        res.status(200).json({
          success: true,
          message: 'Token verified',
        })
      )
      .catch(err => next(err));
  }

  static async profile(req: Request, res: Response, next: NextFunction) {
    AuthService.profile(req)
      .then(profile => res.status(200).json(profile))
      .catch(err => next(err));
  }

  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    AuthService.verifyToken(req)
      .then(token => next())
      .catch(err => next(err));
  }

  static async verifyIdToken(req: Request, res: Response, next: NextFunction) {
    AuthService.verifyIdToken(req)
      .then(decodeValue => {
        req.body.user = decodeValue;
        return next();
      })
      .catch(err => next(err));
  }
}
