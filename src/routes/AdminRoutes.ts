import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { CartController } from '../controllers/CartController.js';

const adminRoutes = Router();

adminRoutes.get('/', UserController.getProfileAdmin)
adminRoutes.get('/users', UserController.getAllUsers);
adminRoutes.get('/cart', CartController.getAllCarts);
adminRoutes.get('/:id', UserController.getUser);
adminRoutes.post('/', UserController.createUser);
adminRoutes.post('/update', UserController.updateUser);
adminRoutes.delete('/', UserController.deleteUser);
adminRoutes.get('/:id/activate', UserController.activateUser);
adminRoutes.get('/:id/inactivate', UserController.inactivateUser);

export default adminRoutes;
