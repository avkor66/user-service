import { Router } from 'express';
import { ProfileController } from "../controllers/ProfileController.ts";

const profileRoutes = Router();

profileRoutes.get('/', ProfileController.getProfileData);
profileRoutes.get('/edit', ProfileController.getProfileDataForEdit);
profileRoutes.post('/edit', ProfileController.updateProfileUser);

export default profileRoutes;