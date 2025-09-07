import { Router } from 'express';
import { UserController } from '../controllers/UserController.ts';

const userRoutes = Router();

userRoutes.get('/', UserController.getAllUsers);
userRoutes.get('/:id', UserController.getUser);
userRoutes.post('/', UserController.createUser);
userRoutes.put('/:id', UserController.updateUser);
userRoutes.delete('/:id', UserController.deleteUser);
userRoutes.patch('/:id/activate', UserController.activateUser);
userRoutes.patch('/:id/inactivate', UserController.inactivateUser);

userRoutes.get('/search/email/:email', UserController.findByEmail);
userRoutes.get('/search/role/:role', UserController.findByRole);
userRoutes.get('/status/active', UserController.getActiveUsers);
userRoutes.get('/status/inactive', UserController.getInactiveUsers);

export default userRoutes;
