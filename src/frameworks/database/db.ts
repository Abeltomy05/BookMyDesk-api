import mongoose from 'mongoose';
import { getErrorMessage } from '../../shared/error/errorHandler';
import { config } from '../../shared/config';


export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI as string);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    console.error(`❌ MongoDB connection error: ${getErrorMessage(error)}`);
  }
};