import { inject, injectable } from "tsyringe";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { ISpaceRepository } from "../../entities/repositoryInterfaces/building/space-repository.interface";
import { IBuildingEntity } from "../../entities/models/building.entity";
import { ISpaceEntity } from "../../entities/models/space.entity";
import { toEntityBuilding } from "../../interfaceAdapters/mappers/building.mapper";
import { toEntitySpace } from "../../interfaceAdapters/mappers/space.mapper";
import { IGetSingleBuilding } from "../../entities/usecaseInterfaces/building/get-single-building-usecase.interface";

@injectable()
export class GetSingleBuilding implements IGetSingleBuilding{
     constructor(
    @inject("IBuildingRepository")
    private buildingRepository: IBuildingRepository,
    @inject("ISpaceRepository")
    private spaceRepository: ISpaceRepository,
    ){}

 async execute(id:string): Promise<IBuildingEntity & { spaces: ISpaceEntity[] }>{
     const buildingModel = await this.buildingRepository.findOne({ _id: id });
    if (!buildingModel) {
      throw new Error("Building not found");
    }
 
    const buildingEntity = toEntityBuilding(buildingModel);
    const spaceModels = await this.spaceRepository.find({ buildingId: id });

    const spaceEntities = spaceModels.map(toEntitySpace); 

    return {
      ...buildingEntity,
      spaces: spaceEntities,
    };

    }
}