import dotenv from "dotenv";
dotenv.config();

export const config = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV,

    BACKEND_URL: process.env.BACKEND_URL || "http://localhost:3000",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",

    MONGO_URI: process.env.MONGO_URI,
    EMAIL_USER: process.env.EMAIL_USER || "greenmind202@gmail.com",
    EMAIL_PASS: process.env.EMAIL_PASS,

    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT || "6379",
    REDIS_USERNAME: process.env.REDIS_USERNAME || "bookmydesk",
    REDIS_PASS: process.env.REDIS_PASS,

    RESET_TOKEN_SECRET: process.env.RESET_TOKEN_SECRET || "reset_token_secret",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "REFRESH_TOKEN_SECRET",
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "access_token_secret",

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,


    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,

    ADMIN_ID: process.env.ADMIN_ID,

    FIREBASE_SERVICE_ACCOUNT_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,

    LOGGER_STATUS: process.env.LOGGER_STATUS || "dev", 
}