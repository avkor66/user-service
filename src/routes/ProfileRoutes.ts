import { Router } from 'express';
import { ProfileController } from "../controllers/ProfileController.ts";

const profileRoutes = Router();

profileRoutes.get('/', ProfileController.getProfileData);
profileRoutes.get('/edit', ProfileController.getProfileDataForEdit);

export default profileRoutes;