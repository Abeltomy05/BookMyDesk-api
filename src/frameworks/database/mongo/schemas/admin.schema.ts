import { Schema } from "mongoose";
import { IAdminModel } from "../models/admin.model";

export const adminSchema = new Schema<IAdminModel>(
  {
    username:  { type: String },
    email:     { type: String, required: true, unique: true },
    password:  { type: String, required: true },
    phone:     { type: String},
    role:      { type: String, default: "admin" },
    avatar:    { type: String },
    status:    { type: String, default: "active" },
    fcmToken:{type: String}
  },
  { timestamps: true }
);