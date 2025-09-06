
import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ri8xy.mongodb.net/${process.env.DB_COLLECTION}?retryWrites=true&w=majority&appName=Cluster0`;
const clientOptions = {
    serverApi: {
        version: '1' as const,
        strict: true,
        deprecationErrors: true
    }
};

async function run() {
    try {
        await mongoose.connect(uri, clientOptions);
        if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
            await mongoose.connection.db.admin().command({ ping: 1 });
            console.log("Успешное подключение к MongoDB!");
        } else {
            console.log("Подключение установлено без ping.");
        }
        console.log("Проверка ping и подключение к MongoDB выполнены успешно!");
    } catch (error) {
        console.error("Ошибка подключения:", error);
        process.exit(1);
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("pong");
})

app.post('/', (req, res) => {
    res.send("POST request");
})

app.put('/user', (req, res) => {
    res.send("PUT request at /user");
})

app.delete('/user', (req, res) => {
    res.send("DELETE request at /user");
})

app.listen(port, () => {
    console.info(`Listening at http://localhost:${port}`)
});
