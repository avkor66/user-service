import { Router } from 'express';
import { ProfileController } from "../controllers/ProfileController.js";
import {UserController} from "../controllers/UserController.js";

const profileRoutes = Router();

profileRoutes.get('/', ProfileController.getProfileData);
profileRoutes.get('/header', ProfileController.getProfileForHeader);
profileRoutes.get('/me', ProfileController.getProfileMe);
profileRoutes.get('/:id/settings', ProfileController.getProfileForId);
profileRoutes.get('/edit', ProfileController.getProfileDataForEdit);
profileRoutes.delete('/', UserController.deleteUser);
profileRoutes.post('/update', UserController.updateUser);
profileRoutes.patch('/update', UserController.updateUserSettings);

export default profileRoutes;