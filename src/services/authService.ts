import { Request } from 'express';

import bcrypt from 'bcryptjs';
import { sign, verify, TokenExpiredError, NotBeforeError, JsonWebTokenError } from 'jsonwebtoken';

import prisma from '../client/client';
import getPayload from '../utils/jwtPayload';
import IJwtPayload from '../interfaces/jwtPayloadInterface';

import AppError from '../errors';
import FirebaseAdmin from '../firebase';
import role from '../middlewares/userRole';
import { User } from '@prisma/client';
import { DecodedIdToken } from 'firebase-admin/auth';

export default class AuthService {
  static async register(req: Request): Promise<User> {
    // Get user input
    const { first_name, last_name, email, password, confirmPassword } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) throw new AppError(400, 'All input is required');

    // Confirm Password
    if (password !== confirmPassword) throw new AppError(400, 'Password must match');

    // if (!isPhoneNum(phone)) throw new AppError(400, 'Phone Number should be 10 Number');

    // Validate if user exist in our database
    const oldUser = await prisma.user.findUnique({
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
    const user = await prisma.user.create({
      data: {
        firstName: first_name,
        lastName: last_name,
        email: userEmail,
        token: encryptedPassword,
        ip: ip?.toString(),
        // profile: {
        //   create: {
        //     avatar: 'https://picsum.photos/200',
        //     bio: 'Lots of really interesting stuff',
        //     phone: 'my-first-post',
        //   },
        // },
      },
    });

    // Create token
    const token = sign(
      { userId: user.id, email: email, role: role.toString() } as IJwtPayload,
      process.env.TOKEN_KEY || '',
      {
        expiresIn: '2h',
      }
    );
    // save user token
    user.token = token;

    return user;
  }

  static async login(req: Request): Promise<User> {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) throw new AppError(400, 'All input is required');

    // Validate if user exist in our database
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) throw new AppError(404, 'User Not Found !!');

    if (!(user && (await bcrypt.compare(password, user.token)))) throw new AppError(400, 'Invalid Credentials');

    // Create token
    const token = sign(
      { userId: user.id, email: email, role: user.role.toString() } as IJwtPayload,
      process.env.TOKEN_KEY || '',
      {
        expiresIn: '2h',
      }
    );

    // save user token
    user.token = token;

    return user;
  }

  static async social(req: Request): Promise<User> {
    // Get user input
    const { first_name, last_name, email } = req.body;

    // Validate if user exist in our database
    var user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      // Get firebase token
      const token = req?.headers?.authorization?.split(' ')[1] ?? '';

      var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      // Create user in our database
      user = await prisma.user.create({
        data: {
          firstName: first_name,
          lastName: last_name,
          email: email,
          token: token,
          ip: ip?.toString(),
        },
      });
    }

    // Create token
    const token = sign(
      { userId: user!.id, email: email, role: user.role.toString() } as IJwtPayload,
      process.env.TOKEN_KEY || '',
      {
        expiresIn: '2h',
      }
    );

    // save user token
    user!.token = token;

    return user;

    /*  // Our login logic starts here
    try {
      // Get user input
      const { first_name, last_name, email } = req.body;

      // Validate if user exist in our database
      var user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        // Get firebase token
        const token = req?.headers?.authorization?.split(' ')[1] ?? '';

        var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Create user in our database
        user = await prisma.user.create({
          data: {
            firstName: first_name,
            lastName: last_name,
            email: email,
            token: token,
            ip: ip?.toString(),
          },
        });
      }

      // Create token
      const token = sign(
        { userId: user!.id, email: email, role: user.role.toString() } as IJwtPayload,
        process.env.TOKEN_KEY || '',
        {
          expiresIn: '2h',
        }
      );

      // save user token
      user!.token = token;

      // user
      res.status(200).json({
        success: true,
        message: 'User Logged Successfully',
        data: user,
      });
    } catch (e) {
      next(e);
    }
    // Our register logic ends here */
  }

  static async profile(req: Request): Promise<User> {
    // Get user input
    var payload: IJwtPayload = getPayload(req);

    const id = payload.userId;

    if (!id) throw new AppError(400, 'Bad request!!');
    if (id.length != 24) throw new AppError(404, 'Wrong User Id!!');

    // Validate if user exist in our database
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        profile: true,
      },
    });

    if (!user) throw new AppError(404, 'User Not Found !!');

    return user;
  }

  static async verifyToken(req: Request): Promise<string> {
    const token: string = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) throw new AppError(403, 'A token is required for authentication');

    verify(token, process.env.TOKEN_KEY || '', (err: any, decoded: any) => {
      if (err instanceof TokenExpiredError) throw new AppError(403, 'Unauthorized! Access Token was expired!');
      if (err instanceof NotBeforeError) throw new AppError(403, 'jwt not active');
      if (err instanceof JsonWebTokenError) throw new AppError(403, 'jwt malformed');
    });

    return token;
  }

  static async verifyIdToken(req: Request): Promise<DecodedIdToken> {
    const token = req?.headers?.authorization?.split(' ')[1];
    if (!token) throw new AppError(401, 'Token is required');
    const decodeValue = await FirebaseAdmin.auth.verifyIdToken(token);
    if (!decodeValue) throw new AppError(401, 'Token is not valid!');

    return decodeValue;

    /*  try {
      if (!token) throw new AppError(401, 'Token is required');
      const decodeValue = await FirebaseAdmin.verifyIdToken(token);
      if (decodeValue) {
        req.body.user = decodeValue;
        return next();
      }
    } catch (e) {
      next(e);
    } */
  }
}
