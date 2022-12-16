import { Request, Response, NextFunction } from 'express';

import { verify, TokenExpiredError, NotBeforeError, JsonWebTokenError } from 'jsonwebtoken';

import bcrypt from 'bcryptjs';
import { sign, decode } from 'jsonwebtoken';

import prisma from '../client/client';
import isPhoneNum from '../utils/isPhone';
import { MyJwtPayload } from '../interfaces/MyJwtPayload';

import { AppError } from '../errors';
import auth from '../firebase';

export default class AuthService {
  static async register(req: Request, res: Response, next: NextFunction) {
    // Our register logic starts here
    try {
      // Get user input
      const { first_name, last_name, email, password, confirmPassword, phone } = req.body;

      // Validate user input
      if (!(email && password && first_name && last_name)) throw new AppError(400, 'All input is required');

      // Confirm Password
      if (password !== confirmPassword) throw new AppError(400, 'Password must match');

      if (!isPhoneNum(phone)) throw new AppError(400, 'Phone Number should be 10 Number');

      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await prisma.patient.findUnique({
        where: {
          email: email,
        },
      });
      // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#examples-4

      if (oldUser) throw new AppError(409, 'User Already Exist. Please Login');

      // Encrypt user password
      const encryptedPassword = await bcrypt.hash(password, 10);
      var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      // sanitize: convert email to lowercase
      var userEmail = email.replace(/^\s+|\s+$/g, '').toLowerCase();

      // Create user in our database
      const user = await prisma.patient.create({
        data: {
          firstName: first_name,
          lastName: last_name,
          email: userEmail,
          token: encryptedPassword,
          phone: phone,
          ip: ip?.toString(),
          appointments: {
            create: {
              title: 'My first post',
              slug: 'my-first-post',
              category: 'teeth',
              description: 'Lots of really interesting stuff',
            },
          },
        },
      });

      // Create token
      const token = sign({ user_id: user.id, email }, process.env.TOKEN_KEY || '', {
        expiresIn: '2h',
      });
      // save user token
      user.token = token;

      // return new user
      res.status(201).json({
        success: true,
        message: 'User Created Successfully',
        data: user,
      });
    } catch (e) {
      next(e);
    }
    // Our register logic ends here
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;

      // Validate user input
      if (!(email && password)) throw new AppError(400, 'All input is required');

      // Validate if user exist in our database
      const user = await prisma.patient.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) throw new AppError(404, 'User Not Found !!');

      if (!(user && (await bcrypt.compare(password, user.token)))) throw new AppError(400, 'Invalid Credentials');
      // Create token
      const token = sign({ user_id: user.id, email }, process.env.TOKEN_KEY || '', {
        expiresIn: '2h',
      });

      // save user token
      user.token = token;

      // user
      res.status(200).json({
        success: true,
        message: 'User Logged Successfully',
        data: user,
      });
    } catch (e) {
      next(e);
    }
    // Our register logic ends here
  }

  static async validate(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({
        success: true,
        message: 'Token verified',
      });
    } catch (e) {
      next(e);
    }
  }

  static async profile(req: Request, res: Response, next: NextFunction) {
    try {
      // Get user input
      const token = req.headers['x-access-token']?.toString();
      if (!token) throw new AppError(400, 'Bad request!!');

      const decoded = decode(token, { complete: true });
      if (!decoded?.payload) throw new AppError(400, 'Bad request!!');

      var payload = decoded?.payload as MyJwtPayload;

      const id = payload.user_id;

      if (!id) throw new AppError(400, 'Bad request!!');
      if (id.length != 24) throw new AppError(404, 'Wrong User Id!!');

      // Validate if user exist in our database
      const user = await prisma.patient.findUnique({
        where: {
          id: id,
        },
      });

      if (!user) throw new AppError(404, 'User Not Found !!');

      // stop further execution in this callback
      // user
      return res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      });
    } catch (e) {
      next(e);
    }
  }

  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      // const token = req.headers['x-access-token']?.toString();
      const token = req.body.token || req.query.token || req.headers['x-access-token'];

      if (!token) throw new AppError(403, 'A token is required for authentication');

      const decoded = verify(token, process.env.TOKEN_KEY || '', (err: any, decoded: any) => {
        if (err instanceof TokenExpiredError) throw new AppError(403, 'Unauthorized! Access Token was expired!');
        if (err instanceof NotBeforeError) throw new AppError(403, 'jwt not active');
        if (err instanceof JsonWebTokenError) throw new AppError(403, 'jwt malformed');
      });
      req.body.user = decoded;

      return next();
    } catch (e) {
      next(e);
    }
  }

  static async verifyIdToken(req: Request, res: Response, next: NextFunction) {
    const token = req?.headers?.authorization?.split(' ')[1];

    try {
      if (!token) throw new AppError(401, 'Token is required');
      const decodeValue = await auth.verifyIdToken(token);
      if (decodeValue) {
        req.body.user = decodeValue;
        return next();
      }
    } catch (e) {
      next(e);
    }
  }
}
