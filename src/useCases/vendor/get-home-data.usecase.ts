import { inject, injectable } from "tsyringe";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/wallet-repository.interface";
import { IWalletTransactionRepository } from "../../entities/repositoryInterfaces/wallet/walletTrasaction-repository.interface";
import { VendorHomeDataResultDTO } from "../../shared/dtos/booking.dto";
import { IGetVendorHomeData } from "../../entities/usecaseInterfaces/vendor/get-vendor-home-data-usecase.interface";


@injectable()
export class GetVendorHomeData implements IGetVendorHomeData{
    constructor(
       @inject("IBuildingRepository") 
       private _buildingRepo: IBuildingRepository,
       @inject("IBookingRepository") 
       private _bookingRepo: IBookingRepository,
       @inject("IWalletRepository") 
       private _walletRepo: IWalletRepository,
       @inject("IWalletTransactionRepository") 
       private _walletTxnRepo: IWalletTransactionRepository
    ){}

    async execute(vendorId: string, page = 1, limit = 10, onlyTable=false):Promise<VendorHomeDataResultDTO>{
       const skip = (page - 1) * limit;

       let buildings: any[] = [];
       let wallet: any = null;
       let walletTxns: any[] = [];

        if (!onlyTable) {
            [buildings, wallet, walletTxns] = await Promise.all([
                this._buildingRepo.find({ vendorId }),
                this._walletRepo.findOne({ userId: vendorId }),
                this._walletTxnRepo.getMonthlyBookingIncome(vendorId),
            ]);
        }

        const completedBookingsPaginated = await this._bookingRepo.findAllWithDetails(
            { vendorId, status: "completed" },
            skip,
            limit,
            { createdAt: -1 },
            "vendor"
        );


        const completedBookings = completedBookingsPaginated.items.map((b:any) => ({
        ...b,
        _id: b._id.toString(),
        clientId: b.clientId?.['_id'] ? b.clientId._id.toString() : b.clientId.toString?.(),
        vendorId: b.vendorId.toString?.(),
        spaceId: b.spaceId?.['_id'] ? b.spaceId._id.toString() : b.spaceId.toString?.(),
        buildingId: b.buildingId?.['_id'] ? b.buildingId._id.toString() : b.buildingId.toString?.(),
        building: b.buildingId?.['buildingName'] ? {
                buildingName: b.buildingId.buildingName,
                location: b.buildingId.location
            } : undefined,
            space: b.spaceId?.['name'] ? {
                name: b.spaceId.name,
                pricePerDay: b.spaceId.pricePerDay
            } : undefined,
            client: b.clientId?.['username'] ? {
                username: b.clientId.username,
                email: b.clientId.email,
                phone: b.clientId.phone
            } : undefined
        }));

         return {
            totalBuildings: onlyTable ? undefined : buildings.length,
            totalSpaces: onlyTable
            ? undefined
            : buildings.reduce(
                (acc, b) =>
                    acc +
                    (b.summarizedSpaces?.reduce(
                    (sum: number, s: any) => sum + (s.count || 0),
                    0
                    ) || 0),
                0
                ),
            totalRevenue: onlyTable ? undefined : wallet?.balance || 0,
            monthlyBookings: onlyTable ? undefined : walletTxns,
            completedBookings,
            completedBookingsCount: completedBookingsPaginated.total,
            pagination: {
            totalItems: completedBookingsPaginated.total,
            currentPage: page,
            totalPages: Math.ceil(completedBookingsPaginated.total / limit),
            },
        };
}
}