import { Router } from 'express';
import AuthController from '@/controllers/authController';
import { loginValidation } from '@/validators/auth';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.post('/login', loginValidation, AuthController.login);

router.post('/refresh-token', AuthController.refreshToken);

router.post('/logout', authenticate, AuthController.logout);

export default router;
