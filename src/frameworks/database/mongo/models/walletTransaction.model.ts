import { model,  Types } from "mongoose";
import { IWalletTransactionEntity } from "../../../../entities/models/walletTransactions.entity";
import { walletTransactionSchema } from "../schemas/walletTransaction.schema";

export interface IWalletTransactionModel extends Omit<IWalletTransactionEntity, "_id" | "walletId">, Document {
    _id: Types.ObjectId;
    walletId: Types.ObjectId;
}

export const WalletTransactionModel = model<IWalletTransactionModel>('WalletTransaction', walletTransactionSchema);
