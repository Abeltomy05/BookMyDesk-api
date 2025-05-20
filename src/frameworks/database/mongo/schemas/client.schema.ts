import { Schema } from 'mongoose';
import { IClientModel } from '../models/client.model'; 

export const clientSchema = new Schema<IClientModel>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, default: 'client' },
    status: { type: String, enum: ["active", "blocked"],default: "active"},
    avatar: { type: String },
    googleId: { type: String },
    walletBalance: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);