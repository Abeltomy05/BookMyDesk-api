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

    async execute(vendorId: string):Promise<VendorHomeDataResultDTO>{

        const [buildings, wallet, walletTxns, completedBookingsPaginated] = await Promise.all([
            this._buildingRepo.find({vendorId}),
            this._walletRepo.findOne({userId:vendorId}),
            this._walletTxnRepo.getMonthlyBookingIncome(vendorId),
            this._bookingRepo.findAllWithDetails(
                { vendorId, status: "completed" },
                0,
                5,
                { createdAt: -1 },
                'vendor',
            ),
        ]);

         const buildingIdsAndName = buildings.map((b)=>{
            return {
                _id:b._id.toString(),
                name: b.buildingName,
            }
         }) 
         const totalBuildings = buildings.length;
         const totalSpaces = buildings.reduce((acc, b) =>
            acc + (b.summarizedSpaces?.reduce((sum, s) => sum + (s.count || 0), 0) || 0), 0
          );

        const totalRevenue = wallet?.balance || 0;
        const monthlyBookings = walletTxns;

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
            totalBuildings,
            totalSpaces,
            completedBookingsCount: completedBookingsPaginated.total,
            totalRevenue,
            monthlyBookings,
            completedBookings,
            buildingIdsAndName,
        } 
}
}