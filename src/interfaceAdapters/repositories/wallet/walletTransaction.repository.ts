import { injectable } from "tsyringe";
import { IWalletTransactionRepository } from "../../../entities/repositoryInterfaces/wallet/walletTrasaction-repository.interface";
import { IWalletTransactionModel, WalletTransactionModel } from "../../../frameworks/database/mongo/models/walletTransaction.model";
import { BaseRepository } from "../base.repository";

@injectable()
export class WalletTransactionRepository extends BaseRepository<IWalletTransactionModel> implements IWalletTransactionRepository{
    constructor(){
        super(WalletTransactionModel)
    }
}