import { inject, injectable } from "tsyringe";
import { IBuildingEntity } from "../../entities/models/building.entity";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { toEntityBuilding } from "../../interfaceAdapters/mappers/building.mapper";
import { IFetchBuildingUseCase } from "../../entities/usecaseInterfaces/building/fetch-building-usecase.interface";


@injectable()
export class FetchBuildingUseCase implements IFetchBuildingUseCase{
    constructor(
    @inject("IBuildingRepository")
    private _buildingRepository: IBuildingRepository,
    ){}

  async execute(page: number, limit: number,filters: {
        locationName?: string;
        type?: string;
        minPrice?: number;
        maxPrice?: number;
        latitude?: number;
        longitude?: number;
        radius?: number;
    } ): Promise<{ items: IBuildingEntity[]; total: number }> {
        const skip = (page - 1) * limit;
        const { items, total } = await this._buildingRepository.searchBuildings(filters, skip, limit, { createdAt: -1 });

        return {
        items: items.map(toEntityBuilding),
        total,
        };
    }
}