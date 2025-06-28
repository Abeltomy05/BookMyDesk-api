import { injectable } from "tsyringe";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/wallet/wallet-repository.interface";
import { IWalletModel, WalletModel } from "../../../frameworks/database/mongo/models/wallet.model";
import { BaseRepository } from "../base.repository";
import { Types } from "mongoose";
import { IWalletEntity } from "../../../entities/models/wallet.entity";

@injectable()
export class WalletRepository extends BaseRepository<IWalletModel> implements IWalletRepository {
    constructor(){
        super(WalletModel);
    }

    async updateOrCreateWalletBalance(userId: string,  role: 'Client' | 'Vendor' | 'Admin',  amount: number): Promise<{
        wallet: IWalletEntity;
        balanceBefore: number;
        balanceAfter: number; 
    }> {
    let wallet = await this.findOne({ userId: new Types.ObjectId(userId), role });

    let balanceBefore = 0;
    let balanceAfter = 0;

    if (!wallet) {
        balanceBefore = 0;
        balanceAfter = amount;

        wallet = await this.save({
            userId: new Types.ObjectId(userId),
            role,
            balance: balanceAfter,
        });
    } else {
        balanceBefore = wallet.balance;
        balanceAfter = balanceBefore + amount;

        await this.update({ _id: wallet._id }, { balance: balanceAfter });
    }

    return { 
         wallet: {
            ...wallet,
            _id: wallet._id.toString(),
            userId: wallet.userId.toString(),
        },
        balanceBefore, 
        balanceAfter 
    };
}
}