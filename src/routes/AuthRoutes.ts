import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.ts';

const authRoutes = Router();

authRoutes.post('/signin', AuthController.authSignin);
authRoutes.post('/signup', AuthController.authSignup);
authRoutes.get('/logout', (req, res) => {
    res.render('success', {
        title: 'Logout!',
        heading: 'Logout user.',
        message: 'You have logged out of your profile.',
        path: '/',
    })
});

export default authRoutes;