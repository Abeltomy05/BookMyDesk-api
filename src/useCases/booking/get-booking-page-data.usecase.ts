import { inject, injectable } from "tsyringe";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { ISpaceRepository } from "../../entities/repositoryInterfaces/building/space-repository.interface";
import { toEntitySpace } from "../../interfaceAdapters/mappers/space.mapper";
import { ISpaceEntity } from "../../entities/models/space.entity";
import { IGetBookingPageDataUseCase } from "../../entities/usecaseInterfaces/booking/booking-page-data-usecase.interface";


@injectable()
export class GetBookingPageDataUseCase implements IGetBookingPageDataUseCase{
    constructor(
    @inject("IBuildingRepository")
    private _buildingRepository: IBuildingRepository,
    @inject("ISpaceRepository")
    private _spaceRepository: ISpaceRepository,
    ){}

    async execute(spaceId:string):Promise<{
         space: ISpaceEntity, 
         building:{
            location:string,
            images:string[] | null;
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

         return {
            space: spaceEntity,
            building: {
                location: building.location?.displayName || "",
                images: building.images && building.images.length > 0
                ? building.images.slice(0, 3)
                : null,
            },
        };

    }
}