import { Request, Response, NextFunction } from 'express';

import { verify, TokenExpiredError, NotBeforeError, JsonWebTokenError } from 'jsonwebtoken';

import bcrypt from 'bcryptjs';
import { sign, decode } from 'jsonwebtoken';

import prisma from '../client/client';
import isPhoneNum from '../utils/isPhone';
import MyJwtPayload from '../interfaces/MyJwtPayload';

export default class AuthService {
  static async register(req: Request, res: Response) {
    // Our register logic starts here
    try {
      // Get user input
      const { first_name, last_name, email, password, confirmPassword, phone } = req.body;

      // Validate user input
      if (!(email && password && first_name && last_name)) {
        res.status(400).json({
          success: false,
          message: 'All input is required',
        });
      }

      // Confirm Password
      if (password !== confirmPassword) {
        res.status(400).json({
          success: false,
          message: 'Password must match',
        });
      }

      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await prisma.patient.findUnique({
        where: {
          email: email,
        },
      });
      // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#examples-4

      if (oldUser) {
        return res.status(409).json({
          success: false,
          message: 'User Already Exist. Please Login',
        });
      }

      if (!isPhoneNum(phone)) {
        return res.status(400).send({
          success: false,
          message: 'Phone Number should be 10 Number',
        });
      }

      // Encrypt user password
      const encryptedPassword = await bcrypt.hash(password, 10);
      var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      // sanitize: convert email to lowercase
      var userEmail = email.replace(/^\s+|\s+$/g, '').toLowerCase();

      // Create user in our database
      const user = await prisma.patient.create({
        data: {
          name: first_name + ' ' + last_name,
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
    } catch (err) {
      console.log(err);
      return;
    }
    // Our register logic ends here
  }

  static async login(req: Request, res: Response) {
    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;

      // Validate user input
      if (!(email && password)) {
        res.status(400).send('All input is required');
      }

      // Validate if user exist in our database
      const user = await prisma.patient.findUnique({
        where: {
          email: email,
        },
      });

      if (user && (await bcrypt.compare(password, user.token))) {
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
      } else {
        res.status(400).json({
          success: false,
          message: 'Invalid Credentials',
        });
        // stop further execution in this callback
        return;
      }
    } catch (err) {
      console.log(err);
      return;
    }
    // Our register logic ends here
  }

  static async validate(req: Request, res: Response) {
    try {
      res.status(200).json({
        success: true,
        message: 'Token verified',
      });
    } catch (err) {
      console.log(err);
      return;
    }
  }

  static async profile(req: Request, res: Response) {
    try {
      // Get user input
      const token = req.headers['x-access-token']?.toString();
      if (!token) {
        res.status(400).json({
          success: false,
          message: 'Bad request!!',
        });
        return;
      }
      const decoded = decode(token, { complete: true });
      if (!decoded?.payload) {
        return res.status(400).json({
          success: false,
          message: 'Bad request!!',
        });
      }
      var payload = decoded?.payload as MyJwtPayload;

      const id = payload.user_id;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Bad request!!',
        });
      }
      if (id.length != 24) {
        return res.status(400).json({
          success: false,
          message: 'Wrong User Id!!',
        });
      }

      // Validate if user exist in our database
      const user = await prisma.patient.findUnique({
        where: {
          id: id,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User Not Found!!',
        });
        // stop further execution in this callback
      } else {
        // user
        return res.status(200).json({
          name: user.name,
          email: user.email,
          phone: user.phone,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        success: false,
        message: err,
      });
    }
  }

  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers['x-access-token']?.toString();

      if (!token) {
        return res.status(403).json({
          success: false,
          message: 'A token is required for authentication',
        });
      }
      const decoded = verify(token, process.env.TOKEN_KEY || '', (err: any, decoded: any) => {
        if (err instanceof TokenExpiredError) throw 'Unauthorized! Access Token was expired!';
        if (err instanceof NotBeforeError) throw 'jwt not active';
        if (err instanceof JsonWebTokenError) throw 'jwt malformed';
      });
      req.body.user = decoded;

      return next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: err,
      });
    }
  }
}
