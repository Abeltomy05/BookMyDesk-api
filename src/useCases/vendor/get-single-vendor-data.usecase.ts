import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/wallet-repository.interface";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { IVendorDataResponseDTO } from "../../shared/dtos/vendorInfo.dto";
import { IGetSingleVendorData } from "../../entities/usecaseInterfaces/vendor/get-single-vendorData-usecase.interface";

@injectable()
export class GetSingleVendorData implements IGetSingleVendorData{
    constructor(
       @inject("IBookingRepository")
       private _bookingRepo: IBookingRepository,
       @inject("IWalletRepository")
       private _walletRepo: IWalletRepository,
       @inject("IBuildingRepository")
       private _buildingRepo: IBuildingRepository,
    ){}

    async execute(vendorId:string):Promise<IVendorDataResponseDTO>{
        if(!vendorId) throw new Error("Vendor Id missing, Please try again.");

        const totalBookings = await this._bookingRepo.countDocuments({
            vendorId,
            status: { $in: ["confirmed", "completed"] },
            });

        const buildings = await this._buildingRepo.find({vendorId},{_id:0,buildingName:1,summarizedSpaces:1});

        const totalRevenue = await this._walletRepo.findOne({userId:vendorId},{_id:0,balance:1})

        return {
           totalBookings,
           buildings,
           totalRevenue
        }
    }
}