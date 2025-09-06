import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/UserRoutes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3000;

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


app.use('/user', router);

app.listen(port, () => {
    console.info(`Listening at http://localhost:${port}`)
});
