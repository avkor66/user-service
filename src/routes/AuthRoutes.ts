import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.ts';

const authRoutes = Router();

authRoutes.post('/signin', AuthController.authSignin);
authRoutes.post('/signup', AuthController.authSignup);

export default authRoutes;