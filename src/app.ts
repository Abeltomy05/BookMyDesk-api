import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import passport from "passport";
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import { connectDB } from './frameworks/database/db';
import {AuthRoutes} from './frameworks/routes/auth.route'; 
import './frameworks/passport/google.strategy'
import { ClientRoutes } from './frameworks/routes/client.route';
import { VendorRoutes } from './frameworks/routes/vendor.route';
import { AdminRoutes } from './frameworks/routes/admin.route';


dotenv.config();

const app= express();

app.use(passport.initialize());
app.use(morgan("dev"))

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

// app.use((req, res, next) => {
//   console.log("➡️ Incoming request:", req.method, req.url);
//   next();
// });

app.use('/api/auth', new AuthRoutes().router);
app.use('/api/_c', new ClientRoutes().router);
app.use('/api/_v', new VendorRoutes().router);
app.use('/api/_a', new AdminRoutes().router);


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

