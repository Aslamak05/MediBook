import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
  try {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/medibook';
    await mongoose.connect(mongoUrl);
    console.log('✓ MongoDB connected');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

export function disconnectDB() {
  return mongoose.disconnect();
}
