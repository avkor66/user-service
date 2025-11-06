import path from 'path';
import { config as configDotenv } from "dotenv";

configDotenv({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
  )
});

export const config = {
  // Базовые настройки
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.USER_SERVICE_PORT || '3000',

  // База данных
  MONGO_DB_HOST: process.env.USER_SERVICE_MONGO_DB_HOST,
  MONGO_DB_PORT: process.env.USER_SERVICE_MONGO_DB_PORT,
  MONGO_DB_COLLECTION: process.env.USER_SERVICE_MONGO_DB_COLLECTION,
  MONGO_DB_USER: process.env.USER_SERVICE_MONGO_DB_USER,
  MONGO_DB_PASSWORD: process.env.USER_SERVICE_MONGO_DB_PASSWORD,

  // JWT
  JWT_SECRET: process.env.USER_SERVICE_JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.USER_SERVICE_JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN: process.env.USER_SERVICE_JWT_EXPIRES_IN || '7d',

  // API Keys
  // SENDGRID_API_KEY: process.env.USER_SERVICE_SENDGRID_API_KEY,

  // URLs
  CLIENT_URL: process.env.FRONTEND_CLIENT_URL,
  MATERIAL_PRICE_SERVICE_HOST: process.env.MATERIAL_PRICE_SERVICE_HOST,
  USER_SERVICE_HOST: process.env.USER_SERVICE_HOST,
  COST_CALCULATION_SERVICE_HOST: process.env.COST_CALCULATION_SERVICE_HOST,
  APPLICATION_SERVICE_HOST: process.env.APPLICATION_SERVICE_HOST,
};
