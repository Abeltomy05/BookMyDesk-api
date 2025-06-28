import { IWalletModel } from "../../../frameworks/database/mongo/models/wallet.model";
import { IWalletEntity } from "../../models/wallet.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IWalletRepository extends IBaseRepository<IWalletModel> {
   updateOrCreateWalletBalance(userId: string,  role: 'Client' | 'Vendor' | 'Admin',  amount: number): Promise<{
           wallet: IWalletEntity;
           balanceBefore: number;
           balanceAfter: number; 
       }>
}