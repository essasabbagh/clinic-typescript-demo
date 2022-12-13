import { Router } from 'express';
import { errorHandler } from '../middlewares/handle-error';

import AuthService from '../controllers/AuthService';

const router = Router();

router.use(errorHandler);

router.post('/social', AuthService.register);

router.post('/signup', AuthService.register);

router.post('/login', AuthService.login);

router.post('/validate', AuthService.verifyToken, AuthService.validate);

router.get('/profile', AuthService.verifyToken, AuthService.profile);

export default router;
