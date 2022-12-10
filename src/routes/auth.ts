import { Request, Response, Router } from 'express';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import prisma from '../client/client';
import verifyToken from '../utils/isAuth';
import isPhoneNum from '../utils/isPhone';

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
  // Our register logic starts here
  try {
    // Get user input
    const { first_name, last_name, email, password, phone } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).json({
        success: false,
        message: 'All input is required',
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
    const token = jwt.sign({ user_id: user.id, email }, process.env.TOKEN_KEY || '', {
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
});

router.post('/login', async (req: Request, res: Response) => {
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
      const token = jwt.sign({ user_id: user.id, email }, process.env.TOKEN_KEY || '', {
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
});

router.post('/validate', verifyToken, async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Token verified',
    });
  } catch (err) {
    console.log(err);
    return;
  }
});

router.get('/profile', verifyToken, async (req: Request, res: Response) => {
  // res.send('Profile');
  try {
    // Get user input
    const { id } = req.body;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Bad request!!',
      });
      return;
    }
    if (id.length != 24) {
      res.status(400).json({
        success: false,
        message: 'Wrong User Id!!',
      });
      return;
    }

    // Validate if user exist in our database
    const user = await prisma.patient.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User Not Found!!',
      });
      // stop further execution in this callback
      return;
    } else {
      // user
      res.status(200).json({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
    return;
  }
});

export default router;
