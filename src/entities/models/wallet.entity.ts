export interface IWalletEntity{
    _id: string;
    userId: string;
    role: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
}