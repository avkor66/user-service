import { Router } from 'express';
import { ProfileController } from "../controllers/ProfileController";
import {UserController} from "../controllers/UserController";

const profileRoutes = Router();

profileRoutes.get('/', ProfileController.getProfileData);
profileRoutes.get('/edit', ProfileController.getProfileDataForEdit);
profileRoutes.delete('/', UserController.deleteUser);
profileRoutes.post('/update', UserController.updateUser);

export default profileRoutes;