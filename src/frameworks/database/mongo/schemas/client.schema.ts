import { Schema } from 'mongoose';
import { IClientModel } from '../models/client.model'; 

export const clientSchema = new Schema<IClientModel>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    role: { type: String, default: 'client' },
    status: { type: String, enum: ["active", "blocked"],default: "active"},
    avatar: { type: String },
    googleId: { type: String },
    walletBalance: { type: Number, default: 0 },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      name: { type: String },
      displayName: { type: String },
      zipCode: { type: String },
      coordinates: { type: [Number], default: [0, 0] }
    },
    fcmToken:{type: String}
  },
  {
    timestamps: true,
  }
);

clientSchema.index({ "location.coordinates": "2dsphere" });