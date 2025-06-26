import { injectable } from "tsyringe";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/wallet/wallet-repository.interface";
import { IWalletModel, WalletModel } from "../../../frameworks/database/mongo/models/wallet.model";
import { BaseRepository } from "../base.repository";

@injectable()
export class WalletRepository extends BaseRepository<IWalletModel> implements IWalletRepository {
    constructor(){
        super(WalletModel);
    }
}