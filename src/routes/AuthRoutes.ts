import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.ts';

const authRoutes = Router();

authRoutes.post('/signin', AuthController.authSignin);

export default authRoutes;