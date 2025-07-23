import { inject, injectable } from "tsyringe";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { IFetchFiltersUseCase } from "../../entities/usecaseInterfaces/building/fetch-filter-usecase.interface";

@injectable()
export class FetchFiltersUseCase implements IFetchFiltersUseCase{
    constructor(
     @inject("IBuildingRepository") 
     private _buildingRepo: IBuildingRepository,
    ){}

    async execute(): Promise<{ spaceNames: string[]; prices: number[] }> {
        return this._buildingRepo.fetchFilters();
    }
}