import { model,  Types } from "mongoose";
import { IWalletEntity } from "../../../../entities/models/wallet.entity";
import { walletSchema } from "../schemas/wallet.schema";

export interface IWalletModel extends Omit<IWalletEntity, "_id" | "userId">, Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
}

export const WalletModel = model<IWalletModel>('Wallet', walletSchema);
