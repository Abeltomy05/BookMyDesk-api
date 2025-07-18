import { WalletTransactionTypes } from "../../shared/types/user.types";

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