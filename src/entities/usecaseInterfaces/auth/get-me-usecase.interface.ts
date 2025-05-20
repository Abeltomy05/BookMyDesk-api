import { IAdminModel } from "../../../frameworks/database/mongo/models/admin.model";
import { IClientModel } from "../../../frameworks/database/mongo/models/client.model";
import { IVendorModel } from "../../../frameworks/database/mongo/models/vendor.model";

export interface IGetMeUseCase{
    execute : (token: string)=>Promise<Partial<IVendorModel | IClientModel | IAdminModel> | null>
}