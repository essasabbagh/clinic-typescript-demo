import { Role } from '.prisma/client';
import { Request, Response, NextFunction } from 'express';

import AppError from '../errors';
import IJwtPayload from '../interfaces/jwtPayloadInterface';
import getPayload from '../utils/jwtPayload';

// export const authorize = (roles: string[] = []) => {
//   // roles param can be a single role string (e.g. Role.User or 'User')
//   // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
//   if (typeof roles === 'string') roles = [roles];

//   return [
//     // authenticate JWT token and attach user to request object (req.user)
//     // jwt({ secret, algorithms: ['HS256'] }),

//     // authorize based on user role
//     (req: Request, res: Response, next: NextFunction) => {
//       // Get user input
//       const token = req.headers['x-access-token']?.toString();
//       if (!token) throw new AppError(400, 'Bad request!!');

//       const decoded = decode(token, { complete: true });
//       if (!decoded?.payload) throw new AppError(400, 'Bad request!!');

//       var payload = decoded?.payload as IJwtPayload;

//       const role = payload.role;

//       // user's role is not authorized
//       if (roles.length && !roles.includes(role)) throw new AppError(401, 'Unauthorized!!');

//       // authentication and authorization successful
//       next();
//     },
//   ];
// };

export default (role: Role) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    var payload: IJwtPayload = getPayload(req);

    var userRole = payload.role;

    if (!userRole) userRole = Role.PATIENT;

    if (userRole === role) return next();
    throw new AppError(403, 'You do not have the authorization to access this');
  } catch (err) {
    next(err);
  }
};
