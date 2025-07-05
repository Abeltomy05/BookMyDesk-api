import { IBuildingEntity } from "../../models/building.entity";
import { IOfferEntity } from "../../models/offer.entity";
import { ISpaceEntity } from "../../models/space.entity";

export interface IGetSingleBuilding{
    execute(id:string): Promise<IBuildingEntity & { spaces: (ISpaceEntity & { offer?: Partial<IOfferEntity> })[] }>;
}