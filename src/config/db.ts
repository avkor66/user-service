import mongoose from "mongoose";

export async function connectDB() {
  const uri = `mongodb+srv://${process.env.USER_SERVICE_MONGO_DB_USER}:${process.env.USER_SERVICE_MONGO_DB_PASSWORD}@cluster0.ri8xy.mongodb.net/${process.env.USER_SERVICE_MONGO_DB_COLLECTION}?retryWrites=true&w=majority&appName=Cluster0`;
  try {
    await mongoose.connect(uri);
    console.log('Успешное подключение к MongoDB!');
  } catch (error) {
    console.error('Ошибка подключения:', error);
    process.exit(1);
  }
}