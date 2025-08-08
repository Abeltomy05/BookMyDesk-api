import { inject, injectable } from "tsyringe";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { ISpaceRepository } from "../../entities/repositoryInterfaces/building/space-repository.interface";
import { toEntitySpace } from "../../interfaceAdapters/mappers/space.mapper";
import { ISpaceEntity } from "../../entities/models/space.entity";
import { IGetBookingPageDataUseCase } from "../../entities/usecaseInterfaces/booking/booking-page-data-usecase.interface";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/wallet-repository.interface";
import { IOfferRepository } from "../../entities/repositoryInterfaces/offer/offer-repository.interface";
import { off, title } from "process";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { ERROR_MESSAGES } from "../../shared/constants";


@injectable()
export class GetBookingPageDataUseCase implements IGetBookingPageDataUseCase{
    constructor(
    @inject("IBuildingRepository")
    private _buildingRepository: IBuildingRepository,
    @inject("ISpaceRepository")
    private _spaceRepository: ISpaceRepository,
    @inject("IWalletRepository")
    private _walletRepository: IWalletRepository,
    @inject("IOfferRepository")
    private _offerRepository: IOfferRepository,
    ){}

    async execute(spaceId:string,userId:string):Promise<{
         space: ISpaceEntity, 
         building:{
            location:string,
            images:string[] | null;
         },
        wallet:{
            _id:string | undefined,
            balance:number | undefined
        },
        offer?:{
                title?: string,
                description?: string,
                startDate?: Date,
                endDate?: Date,
                discountPercentage?: number
            },}>{
        const spaceModel = await this._spaceRepository.findOne({ _id: spaceId });
        if (!spaceModel) {
        throw new CustomError(ERROR_MESSAGES.SPACE_NOT_FOUND,StatusCodes.NOT_FOUND);
        }

        const offer = await this._offerRepository.findOne({spaceId});

       const spaceEntity = toEntitySpace(spaceModel);

       const building = await this._buildingRepository.findOne({ _id: spaceEntity.buildingId });
       if (!building) {
        throw new CustomError(ERROR_MESSAGES.BUILDING_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

      const wallet = await this._walletRepository.findOne({userId},{balance:1})  

         return {
            space: spaceEntity,
            building: {
                location: building.location?.displayName || "",
                images: building.images && building.images.length > 0
                ? building.images.slice(0, 3)
                : null,
            },
            wallet:{
              _id:wallet?._id.toString(),
              balance:wallet?.balance,
            },
            offer:{
                title: offer?.title,
                description: offer?.description,
                startDate: offer?.startDate,
                endDate: offer?.endDate,
                discountPercentage: offer?.discountPercentage
            },
        };

    }
}