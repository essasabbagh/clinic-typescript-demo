// import { Request, Response, NextFunction } from 'express';
// import AuthService from './authService';

// export default class AuthController {
//   static async register(req: Request, res: Response, next: NextFunction) {
//     AuthService.register(req, res, next)
//       .then(user => {
//         res.status(201).json({
//           success: true,
//           message: 'User Created Successfully',
//           data: user,
//         });
//       })
//       .catch(err => next(err));
//   }
// }
