import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/UserRoutes.ts';
import { engine } from 'express-handlebars';
import authRoutes from "./routes/AuthRoutes.ts";
import profileRoutes from "./routes/ProfileRoutes.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3000;

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.resolve(__dirname, "./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ri8xy.mongodb.net/${process.env.DB_COLLECTION}?retryWrites=true&w=majority&appName=Cluster0`;

async function run() {
    try {
        await mongoose.connect(uri);
        console.log("Успешное подключение к MongoDB!");
    } catch (error) {
        console.error("Ошибка подключения:", error);
        process.exit(1);
    }
}
run();

app.get('/', (req, res) => {
    res.redirect('/signin');
})
app.get('/signin', (req, res) => {
    res.render('signin', { title: 'Signin' });
})
app.get('/signup', (req, res) => {
    res.render('signup', { title: 'Signup' });
})
app.use('/profile', profileRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);


//TO DO exception

app.listen(port, () => {
    console.info(`Listening at http://localhost:${port}`)
});
