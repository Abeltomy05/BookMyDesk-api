import { inject, injectable } from "tsyringe";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { ISpaceRepository } from "../../entities/repositoryInterfaces/building/space-repository.interface";
import { toEntitySpace } from "../../interfaceAdapters/mappers/space.mapper";
import { ISpaceEntity } from "../../entities/models/space.entity";
import { IGetBookingPageDataUseCase } from "../../entities/usecaseInterfaces/booking/booking-page-data-usecase.interface";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/wallet-repository.interface";


@injectable()
export class GetBookingPageDataUseCase implements IGetBookingPageDataUseCase{
    constructor(
    @inject("IBuildingRepository")
    private _buildingRepository: IBuildingRepository,
    @inject("ISpaceRepository")
    private _spaceRepository: ISpaceRepository,
    @inject("IWalletRepository")
    private _walletRepository: IWalletRepository,
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
        }}>{
        const spaceModel = await this._spaceRepository.findOne({ _id: spaceId });
        if (!spaceModel) {
        throw new Error("Space not found");
        }

       const spaceEntity = toEntitySpace(spaceModel);

       const building = await this._buildingRepository.findOne({ _id: spaceEntity.buildingId });
       if (!building) {
        throw new Error("Building not found for the space");
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
        };

    }
}