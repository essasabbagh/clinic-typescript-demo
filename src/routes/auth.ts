import { Router } from 'express';

import AuthService from '../controllers/AuthService';

const router = Router();

router.post('/social', AuthService.register);

router.post('/signup', AuthService.register);

router.post('/login', AuthService.login);

router.post('/validate', AuthService.verifyToken, AuthService.validate);

router.get('/profile', AuthService.verifyToken, AuthService.profile);

export default router;
