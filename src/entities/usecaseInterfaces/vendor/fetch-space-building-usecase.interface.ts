import { ISpaceShort } from "../../../useCases/vendor/fetch-spaces-building.usecase";

export interface IFetchSpacesForBuilding{
    execute(buildingId: string):Promise<ISpaceShort[]>
}