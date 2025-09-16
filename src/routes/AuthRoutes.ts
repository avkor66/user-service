import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';

const authRoutes = Router();

authRoutes.get('/signin', AuthController.authRenderSignin);
authRoutes.get('/signup', AuthController.authRenderSignup);
authRoutes.post('/signin', AuthController.authSignin);
authRoutes.post('/refresh', AuthController.authRefreshToken);
authRoutes.post('/signup', AuthController.authSignup);
authRoutes.get('/logout', AuthController.logout);

export default authRoutes;