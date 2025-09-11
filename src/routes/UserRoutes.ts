import { Router } from 'express';
import { UserController } from '../controllers/UserController.ts';
import passport from "passport";

const userRoutes = Router();

userRoutes.get('/', UserController.getAllUsers);
userRoutes.get('/:id', UserController.getUser);
userRoutes.post('/', UserController.createUser);
userRoutes.post('/update', passport.authenticate('jwt', {session: false}), UserController.updateUser);
userRoutes.delete('/', passport.authenticate('jwt', {session: false}), UserController.deleteUser);
userRoutes.get('/:id/activate', UserController.activateUser);
userRoutes.get('/:id/inactivate', UserController.inactivateUser);

userRoutes.get('/search/email/:email', UserController.findByEmail);
userRoutes.get('/search/role/:role', UserController.findByRole);
userRoutes.get('/status/active', UserController.getActiveUsers);
userRoutes.get('/status/inactive', UserController.getInactiveUsers);

export default userRoutes;
