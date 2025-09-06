import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUser);
router.post('/', UserController.createUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
router.patch('/:id/activate', UserController.activateUser);
router.patch('/:id/deactivate', UserController.deactivateUser);

router.get('/search/email/:email', UserController.findByEmail);
router.get('/search/role/:role', UserController.findByRole);
router.get('/status/active', UserController.getActiveUsers);
router.get('/status/inactive', UserController.getInactiveUsers);

export default router;