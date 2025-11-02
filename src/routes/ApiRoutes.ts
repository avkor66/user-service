import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import {CartController} from "../controllers/CartController.js";

const apiRoutes = Router();

apiRoutes.post('/register', AuthController.authRegister);
apiRoutes.post('/login', AuthController.authLogin);
apiRoutes.post('/calculate', AuthController.authRefreshToken);
apiRoutes.post('/cart', CartController.createCart);


export default apiRoutes;