import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/wallet-repository.interface";
import { IWalletTransactionRepository } from "../../entities/repositoryInterfaces/wallet/walletTrasaction-repository.interface";
import { WalletDetailsDTO } from "../../shared/dtos/wallet.dto";
import { IGetWalletDetailsUseCase } from "../../entities/usecaseInterfaces/wallet/get-walletDetails-usecase.interface";
import { Types } from "mongoose";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";

@injectable()
export class GetWalletDetailsUseCase implements IGetWalletDetailsUseCase {
    constructor(
        @inject("IWalletRepository")
        private _walletRepository: IWalletRepository,
        @inject("IWalletTransactionRepository")
        private _walletTransactionRepository: IWalletTransactionRepository,
    ) {}

    async execute(userId: string, role: string, page: number, limit: number): Promise<WalletDetailsDTO> {
        if (!userId || !role) {
            throw new CustomError("User ID and role are required",StatusCodes.BAD_REQUEST);
        }
       console.log("Looking for wallet:", {
        userId: new Types.ObjectId(userId).toHexString(),
        role
       });
        const wallet = await this._walletRepository.findOne({
            userId: new Types.ObjectId(userId),
            role
        });
        if (!wallet) {
             return {
                walletId: "",
                balance: 0,
                createdAt: new Date(),
                transactions: [],
                pagination: {
                    total: 0,
                    page,
                    limit,
                    pages: 0,
                }
            };
        }

        const skip = (page - 1) * limit;

       const { items: transactions, total } = await this._walletTransactionRepository.findAll(
            {walletId: wallet._id},
            skip,
            limit,
            { createdAt: -1 }
        )

        return {
             walletId: wallet._id.toString(),
             balance: wallet.balance,
             createdAt: wallet.createdAt,
             transactions: transactions.map(transaction => ({
                _id: transaction._id.toString(),
                type: transaction.type,
                amount: transaction.amount,
                description: transaction.description || "",
                balanceBefore: transaction.balanceBefore,
                balanceAfter: transaction.balanceAfter,
                createdAt: transaction.createdAt,
             })),
             pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            }
        }
    }
}