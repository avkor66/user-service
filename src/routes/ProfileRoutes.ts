import { Router } from 'express';

const profileRoutes = Router();

profileRoutes.get('/', (req, res) => {
    res.render('account');
});

export default profileRoutes;