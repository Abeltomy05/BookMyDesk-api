export interface WalletDetailsDTO{
    walletId: string;
    balance: number;
    createdAt: Date;
    transactions: {
        _id: string;
        type: "topup" | "payment" | "refund" | "withdrawal";
        amount: number;
        description?: string;
        balanceBefore: number;
        balanceAfter: number;
        createdAt: Date;
    }[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}