import { Request, Response, NextFunction } from 'express';

import { verify, TokenExpiredError, NotBeforeError, JsonWebTokenError } from 'jsonwebtoken';

// const catchError = (err: TokenExpiredError, res: Response) => {
//   if (err instanceof TokenExpiredError) {
//     return res.status(401).send({ message: 'Unauthorized! Access Token was expired!' });
//   }

//   return res.sendStatus(401).send({ message: 'Unauthorized!' });
// };

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['x-access-token']?.toString();

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'A token is required for authentication',
    });
  }
  try {
    const decoded = verify(token, process.env.TOKEN_KEY || '', (err: any, decoded: any) => {
      if (err instanceof TokenExpiredError) {
        return res.status(401).send({ success: false, message: 'Unauthorized! Access Token was expired!' });
      }
      if (err instanceof NotBeforeError) {
        return res.status(401).send({ success: false, message: 'jwt not active' });
      }
      if (err instanceof JsonWebTokenError) {
        return res.status(401).send({ success: false, message: 'jwt malformed' });
      }
    });
    req.body.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid Token',
    });
  }
};

export default verifyToken;
