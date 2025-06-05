import { IClientEntity } from "../../models/client.entity";
import { IVendorEntity } from "../../models/vendor.entity";

export interface IGetAllUsersUseCase{
    execute(userType:"client"|"vendor",page:number,limit:number,search:string,status: string,excludeStatus: string[]): Promise<{users:(Omit<IClientEntity,"password"> | Omit<IVendorEntity,"password">)[],totalPages: number}>
}