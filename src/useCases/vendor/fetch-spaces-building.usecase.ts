import { inject, injectable } from "tsyringe";
import { ISpaceRepository } from "../../entities/repositoryInterfaces/building/space-repository.interface";
import { IFetchSpacesForBuilding } from "../../entities/usecaseInterfaces/vendor/fetch-space-building-usecase.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { ERROR_MESSAGES } from "../../shared/constants";

export interface ISpaceShort {
  _id: string;
  name: string;
}
@injectable()
export class FetchSpacesForBuilding implements IFetchSpacesForBuilding{
    constructor(
      @inject("ISpaceRepository")
      private _spaceRepo:ISpaceRepository,
    ){}

    async execute(buildingId: string):Promise<ISpaceShort[]>{
        if(!buildingId) throw new CustomError(ERROR_MESSAGES.MISSING_CREDENTIALS,StatusCodes.BAD_REQUEST);

        const spaceDetails = await this._spaceRepo.find(
            {buildingId},
            {name:1}
        )

        return spaceDetails.map((b) => ({
            _id: b._id.toString(),
            name: b.name,
         }));
    }
}