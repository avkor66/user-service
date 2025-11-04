import express, {NextFunction, Request, Response} from "express";
import path from 'path';
import passport from 'passport'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import adminRoutes from './routes/AdminRoutes.js';
import authRoutes from './routes/AuthRoutes.js';
import profileRoutes from './routes/ProfileRoutes.js';
import passportConfig from './middleware/passport.js';
import { IsAdmin } from './middleware/isAdmin.js';
import {connectDB} from "./config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.USER_SERVICE_PORT || '8080';
const corsOptions = {
    origin: ['http://localhost:4200', 'http://localhost:3000', 'https://msametiz96.ru'],
    optionsSuccessStatus: 200,
    credentials: true,
}

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

connectDB()

app.use(passport.initialize());
passportConfig(passport);

app.use((req, res, next) => {
    console.log('=headers', req.headers);
    console.log('=user', req.user)
    console.log('=body', req.body)
    console.log('=query', req.query)
    next()
});

app.get('/', (req, res) => res.redirect('/auth/signin'));
app.use('/auth', cors(corsOptions), authRoutes);
app.use('/profile', cors(corsOptions), passport.authenticate('jwt', {session: false}), profileRoutes);
app.use('/admin', cors(corsOptions), passport.authenticate('jwt', {session: false}), IsAdmin.isAdmin, adminRoutes);
app.get('/health_check', (req: Request, res: Response) => res.status(200).json({status: 'UserService Check OK'}));
app.use((req, res) => {
    res.status(404).render('pages/errors/404', { title: 'Страница не найдена' });
});
app.use((err: Error, req: Request, res: Response) => {
    console.error(err.stack);
    res.status(500).render('pages/errors/500', { title: 'Ошибка сервера', error: err });
});

app.listen(parseInt(port), '0.0.0.0', () => {
    console.info(`Listening at http://localhost:${port}`)
});
