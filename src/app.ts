import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import passport from "passport";
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import { connectDB } from './frameworks/database/db';
import {AuthRoutes} from './frameworks/routes/auth.route'; 
import './frameworks/passport/google.strategy'
import { ClientRoutes } from './frameworks/routes/client.route';
import { VendorRoutes } from './frameworks/routes/vendor.route';
import { AdminRoutes } from './frameworks/routes/admin.route';
import { startOfferCleanupJob } from "./shared/cron/offer-cleanup.cron";
import { ChatSocketHandler  } from './shared/config/socket';
import { container } from 'tsyringe';
import { IChatUseCase } from './entities/usecaseInterfaces/chat/chat-usecase.interface';
import { config } from './shared/config';
import { NotificationSocketHandler } from './shared/config/notificationSocket';
import { INotificationSocketHandler } from './entities/socketInterfaces/notification-socket-handler.interface';
import { initializeNotificationSocket } from './shared/config/setupNotificationSocket';
import { initializeChatSocket } from './shared/config/setupChatSocket';

dotenv.config();

const app= express();
const server = http.createServer(app);

const chatUseCase = container.resolve<IChatUseCase>("IChatUseCase");

initializeChatSocket(server, chatUseCase);
initializeNotificationSocket(server);


app.use(passport.initialize());
app.use(morgan("dev"))

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: config.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type'],
    credentials: true, 
}));

startOfferCleanupJob();

// app.use((req, res, next) => {
//   console.log("➡️ Incoming request:", req.method, req.url);
//   next();
// });

app.use('/api/auth', new AuthRoutes().router);
app.use('/api/_c', new ClientRoutes().router);
app.use('/api/_v', new VendorRoutes().router);
app.use('/api/_a', new AdminRoutes().router);


const PORT = config.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`💻 Socket.IO server is ready`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB. Server not started.');
    process.exit(1);
  }
};

startServer();

