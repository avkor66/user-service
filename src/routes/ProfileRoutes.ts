import { Router } from 'express';

const profileRoutes = Router();

profileRoutes.get('/', (req, res) => {
    res.render('profile');
});
profileRoutes.get('/edit', (req, res) => {
    res.render('edit');
});

export default profileRoutes;