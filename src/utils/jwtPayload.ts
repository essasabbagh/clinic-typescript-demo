import IJwtPayload from '../interfaces/jwtPayloadInterface';
import { Request } from 'express';
import { decode } from 'jsonwebtoken';
import AppError from '../errors';

export default (req: Request): IJwtPayload => {
    // const token = req?.headers?.authorization?.split(' ')[1] ?? '';

  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) throw new AppError(400, 'Bad request!!');

  const decoded = decode(token, { complete: true });
  if (!decoded?.payload) throw new AppError(400, 'Bad request!!');

  var payload = decoded?.payload as IJwtPayload;

  return payload;
};
