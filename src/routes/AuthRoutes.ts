import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';

const authRoutes = Router();

authRoutes.get('/signin', AuthController.authRenderSignin);
authRoutes.get('/signup', AuthController.authRenderSignup);
authRoutes.post('/signin', AuthController.authSignin);
authRoutes.post('/refresh', AuthController.authRefreshToken);
authRoutes.post('/signup', AuthController.authSignup);
authRoutes.post('/logout', AuthController.logout);
authRoutes.post('/password/forgot', AuthController.passwordForgot);
authRoutes.post('/password/reset/:token', AuthController.passwordReset);

export default authRoutes;