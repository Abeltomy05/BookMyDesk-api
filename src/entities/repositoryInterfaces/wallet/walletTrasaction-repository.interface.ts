import { IWalletTransactionModel } from "../../../frameworks/database/mongo/models/walletTransaction.model";
import { IBaseRepository } from "../base-repository.interface";

export interface IWalletTransactionRepository extends IBaseRepository<IWalletTransactionModel> {
   getMonthlyBookingIncome(vendorId:string):Promise< { month: string; revenue: number; bookings: number }[]>;
}