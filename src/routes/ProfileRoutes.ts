import { Router } from 'express';

const profileRoutes = Router();

profileRoutes.get('/', (req, res) => {
    res.render('profile');
});

export default profileRoutes;