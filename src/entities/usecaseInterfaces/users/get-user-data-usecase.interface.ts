import { IClientModel } from "../../../frameworks/database/mongo/models/client.model";
import { IVendorModel } from "../../../frameworks/database/mongo/models/vendor.model";

export interface IGetUserDataUseCase{
    execute(userId: string, role: string): Promise<Omit<IClientModel, 'password'> | Omit<IVendorModel, 'password'>>;
}