import { IClientModel } from "../../../frameworks/database/mongo/models/client.model";
import { IVendorModel } from "../../../frameworks/database/mongo/models/vendor.model";
import { GoogleAuthDTO } from "../../../shared/dtos/user.dto";

export interface IGoogleUseCase{
    execute(data: GoogleAuthDTO):Promise<Partial<IVendorModel | IClientModel>>
}