import { ISpaceEntity } from "../../models/space.entity";

export interface IGetBookingPageDataUseCase{
    execute(spaceId:string):Promise<{
         space: ISpaceEntity, 
         building:{
            location:string,
            images:string[] | null;
         }}>
}