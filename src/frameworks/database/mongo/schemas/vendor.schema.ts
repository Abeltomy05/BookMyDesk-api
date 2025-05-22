import { Schema } from "mongoose";
import { IVendorModel } from "../models/vendor.model";


export const vendorSchema = new Schema<IVendorModel>(
    {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    role: { type: String, default: 'vendor' },
    avatar: { type: String },
    googleId: { type: String },   
    companyName: { type: String },
    companyAddress: { type: String },
    banner: { type: String },
    description: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected","blocked"], default: 'pending' },
    idProof: { type: String },
    },
    {
        timestamps: true,
    }
);