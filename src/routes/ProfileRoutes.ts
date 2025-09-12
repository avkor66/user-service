import { Router } from 'express';
import { ProfileController } from "../controllers/ProfileController.js";
import {UserController} from "../controllers/UserController.js";

const profileRoutes = Router();

profileRoutes.get('/', ProfileController.getProfileData);
profileRoutes.get('/edit', ProfileController.getProfileDataForEdit);
profileRoutes.delete('/', UserController.deleteUser);
profileRoutes.post('/update', UserController.updateUser);

export default profileRoutes;