import { WalletTransactionTypes } from "../../shared/dtos/types/user.types";

export interface IWalletTransactionEntity {
    _id: string;
    walletId: string;
    type: WalletTransactionTypes;
    amount: number;
    description?: string;
    balanceBefore: number;
    balanceAfter: number;
    createdAt: Date;
    updatedAt: Date;
}