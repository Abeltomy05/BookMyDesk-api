import { Schema } from "mongoose";
import { IAdminModel } from "../models/admin.model";

export const adminSchema = new Schema<IAdminModel>(
  {
    username:  { type: String, required: true },
    email:     { type: String, required: true, unique: true },
    password:  { type: String, required: true },
    phone:     { type: String, required: true },
    role:      { type: String, default: "admin" },
    avatar:    { type: String },
    status:    { type: String, default: "active" },
  },
  { timestamps: true }
);