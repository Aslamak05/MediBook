import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: process.env.PORT || 4000,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/medibook',
  JWT_SECRET: process.env.JWT_SECRET || 'replace-me',
  JWT_EXPIRES: process.env.JWT_EXPIRES || '7d',
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
  TWILIO_FROM: process.env.TWILIO_FROM || '+15555555555',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
