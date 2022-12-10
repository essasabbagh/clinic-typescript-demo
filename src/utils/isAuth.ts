import { Request, Response, NextFunction } from 'express';

import { verify } from 'jsonwebtoken';

// const catchError = (err: TokenExpiredError, res: Response) => {
//   if (err instanceof TokenExpiredError) {
//     return res.status(401).send({ message: 'Unauthorized! Access Token was expired!' });
//   }

//   return res.sendStatus(401).send({ message: 'Unauthorized!' });
// };

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'A token is required for authentication',
    });
  }
  try {
    const decoded = verify(token, process.env.TOKEN_KEY || '');
    req.body.user = decoded;
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid Token',
    });
  }
  return next();
};

export default verifyToken;
