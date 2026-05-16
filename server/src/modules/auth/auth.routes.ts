import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { registerValidators, loginValidators } from './auth.validators.js';
import { validateMiddleware } from '../../middleware/validate.middleware.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/register', registerValidators, validateMiddleware, AuthController.register);
router.post('/login', loginValidators, validateMiddleware, AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', authMiddleware, AuthController.logout);
router.get('/me', authMiddleware, AuthController.getMe);

export default router;
