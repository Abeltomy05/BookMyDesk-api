import { inject, injectable } from "tsyringe";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { ISpaceRepository } from "../../entities/repositoryInterfaces/building/space-repository.interface";
import { IBuildingEntity } from "../../entities/models/building.entity";
import { ISpaceEntity } from "../../entities/models/space.entity";
import { toEntityBuilding } from "../../interfaceAdapters/mappers/building.mapper";
import { toEntitySpace } from "../../interfaceAdapters/mappers/space.mapper";
import { IGetSingleBuilding } from "../../entities/usecaseInterfaces/building/get-single-building-usecase.interface";
import { IOfferRepository } from "../../entities/repositoryInterfaces/offer/offer-repository.interface";
import { IOfferEntity } from "../../entities/models/offer.entity";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { ERROR_MESSAGES } from "../../shared/constants";

@injectable()
export class GetSingleBuilding implements IGetSingleBuilding{
     constructor(
    @inject("IBuildingRepository")
    private buildingRepository: IBuildingRepository,
    @inject("ISpaceRepository")
    private spaceRepository: ISpaceRepository,
    @inject("IOfferRepository")
    private offerRepository: IOfferRepository,
    ){}

 async execute(id:string): Promise<IBuildingEntity & { spaces: (ISpaceEntity & { offer?: Partial<IOfferEntity> })[] }>{
     const buildingModel = await this.buildingRepository.findOne({ _id: id });
      if (!buildingModel) {
        throw new CustomError(ERROR_MESSAGES.BUILDING_NOT_FOUND,StatusCodes.NOT_FOUND);
      }
 
    const buildingEntity = toEntityBuilding(buildingModel);
    const spaceModels = await this.spaceRepository.find({ buildingId: id });
    const now = new Date();

    const spaceEntitiesWithOffers = await Promise.all(
        spaceModels.map(async (spaceModel) => {
          const space = toEntitySpace(spaceModel);

          const ongoingOffer = await this.offerRepository.findOne({
            spaceId: space._id,
            buildingId: id,
            startDate: { $lte: now },
            endDate: { $gte: now },
          });

          if (ongoingOffer) {
            const { discountPercentage, title, description, startDate, endDate } = ongoingOffer;
            return {
              ...space,
              offer: { discountPercentage, title, description, startDate, endDate },
            };
          }

          return space;
        })
    );

    return {
      ...buildingEntity,
      spaces: spaceEntitiesWithOffers,
    };

    }
}