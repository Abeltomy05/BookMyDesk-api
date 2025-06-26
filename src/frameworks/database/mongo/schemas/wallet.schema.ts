import { Schema } from "mongoose";
import { IWalletModel } from "../models/wallet.model";


export const walletSchema = new Schema<IWalletModel>(
  {
    userId:   { type: Schema.Types.ObjectId, refPath: "role", required: true },
    role:   { type: String, enum: ["Client", "Vendor", "Admin"], required: true },
    balance: { type: Number, default: 0, required: true },
  },
  { timestamps: true }
);