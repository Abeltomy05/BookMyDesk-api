import { ISpaceEntity } from "../../models/space.entity";

export interface IGetBookingPageDataUseCase{
    execute(spaceId:string,userId:string):Promise<{
         space: ISpaceEntity, 
         building:{
            location:string,
            images:string[] | null;
         },
         wallet:{
            _id:string | undefined,
            balance:number | undefined
        }}>
}