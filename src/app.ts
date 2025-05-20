import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import { connectDB } from './lib/db';
import {AuthRoutes} from './frameworks/routes/auth.route'; 

dotenv.config();

const app= express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log('CORS origin:', process.env.CORS_ORIGIN);
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type'],
    credentials: true, 
}));

app.use('/api/auth', new AuthRoutes().router);


const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB. Server not started.');
    process.exit(1);
  }
};

startServer();

