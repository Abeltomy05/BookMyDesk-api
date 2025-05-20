import { IAdminModel } from "../../../frameworks/database/mongo/models/admin.model";
import { IClientModel } from "../../../frameworks/database/mongo/models/client.model";
import { IVendorModel } from "../../../frameworks/database/mongo/models/vendor.model";
import { LoginUserDTO } from "../../../shared/dtos/user.dto";

export interface ILoginUserUseCase {
    execute: (user:LoginUserDTO) => Promise<Partial<IVendorModel | IAdminModel | IClientModel>>;
}