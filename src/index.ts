import express from 'express';
import {NextFunction, Request, Response} from "express";
import mongoose from 'mongoose';
import path from 'path';
import passport from 'passport'
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import adminRoutes from './routes/AdminRoutes.js';
import authRoutes from './routes/AuthRoutes.js';
import profileRoutes from './routes/ProfileRoutes.js';
import passportConfig from './middleware/passport.js';
import { IsAdmin } from './middleware/isAdmin.js';
import cors from 'cors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 8080;
const corsOptions = {
    origin: ['http://localhost:4200', 'http://localhost:3000', 'https://68f0a0af1f19d5eaa3111693--coruscating-dragon-a7ea37.netlify.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
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

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ri8xy.mongodb.net/${process.env.DB_COLLECTION}?retryWrites=true&w=majority&appName=Cluster0`;

async function run() {
    try {
        await mongoose.connect(uri);
        console.log('Успешное подключение к MongoDB!');
    } catch (error) {
        console.error('Ошибка подключения:', error);
        process.exit(1);
    }
}
run();

app.use(passport.initialize());
passportConfig(passport);

app.get('/', (req, res) => res.redirect('/auth/signin'));
app.use('/auth', cors(corsOptions), authRoutes);
app.use('/profile', cors(corsOptions), passport.authenticate('jwt', {session: false}), profileRoutes);
app.use('/admin', cors(corsOptions), passport.authenticate('jwt', {session: false}), IsAdmin.isAdmin, adminRoutes);

app.use((req, res, next) => {
    res.status(404);
    res.render('pages/errors/404', { title: 'Страница не найдена' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500);
    res.render('pages/errors/500', { title: 'Ошибка сервера', error: err });
});

app.listen(8080, '0.0.0.0', () => {
    console.info(`Listening at http://localhost:${port}`)
});

