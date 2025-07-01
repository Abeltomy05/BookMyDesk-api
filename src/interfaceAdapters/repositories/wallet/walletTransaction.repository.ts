import { inject, injectable } from "tsyringe";
import { IWalletTransactionRepository } from "../../../entities/repositoryInterfaces/wallet/walletTrasaction-repository.interface";
import { IWalletTransactionModel, WalletTransactionModel } from "../../../frameworks/database/mongo/models/walletTransaction.model";
import { BaseRepository } from "../base.repository";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/wallet/wallet-repository.interface";

@injectable()
export class WalletTransactionRepository extends BaseRepository<IWalletTransactionModel> implements IWalletTransactionRepository{
    constructor(
        @inject("IWalletRepository")
        private _walletRepo:IWalletRepository,
    ){
        super(WalletTransactionModel)
    }

    async getMonthlyBookingIncome(vendorId:string):Promise< { month: string; revenue: number; bookings: number }[]>{
        const wallet = await this._walletRepo.findOne({ userId: vendorId });
        if (!wallet) return [];

         const result = await this.model.aggregate([
            {
            $match: {
                walletId: wallet._id,
                type: 'booking-income',
            },
            },
            {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                },
                revenue: { $sum: '$amount' },
                bookings: { $sum: 1 },
            },
            },
            {
              $sort: { '_id.year': 1, '_id.month': 1 },
            },
                {
        $project: {
            _id: 0,
            month: {
            $concat: [
                {
                $arrayElemAt: [
                    [
                    '',
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                    ],
                    '$_id.month',
                ],
                },
                ' ',
                { $toString: '$_id.year' },
            ],
            },
            revenue: 1,
            bookings: 1,
        },
        },
        ]);
        

        return result;
    }


}