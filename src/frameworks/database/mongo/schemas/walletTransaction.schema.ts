import { Schema } from "mongoose";
import { IWalletTransactionModel } from "../models/walletTransaction.model";

export const walletTransactionSchema = new Schema<IWalletTransactionModel>(
  {
    walletId:   { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    type:   { type: String, enum: ["topup" , "payment" , "refund" , "withdrawal", 'platform-fee', 'booking-income'], required: true },
    amount: { type: Number,  required: true },
    description: { type: String,},
    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
  },
  { timestamps: true }
);