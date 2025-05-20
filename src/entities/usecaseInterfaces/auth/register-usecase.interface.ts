import { UserDTO } from "../../../shared/dtos/user.dto";
import { IClientEntity } from "../../models/client.entity";
import { IVendorEntity } from "../../models/vendor.entity";

export interface IRegisterUserUseCase {
    execute: (userData: UserDTO) => Promise<IClientEntity | IVendorEntity | null>;
}