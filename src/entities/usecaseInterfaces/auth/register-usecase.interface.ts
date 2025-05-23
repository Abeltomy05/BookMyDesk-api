import { UserDTO } from "../../../shared/dtos/user.dto";
import { IAdminEntity } from "../../models/admin.entity";
import { IClientEntity } from "../../models/client.entity";
import { IVendorEntity } from "../../models/vendor.entity";

export interface IRegisterUserUseCase {
    execute: (userData: UserDTO) => Promise<IClientEntity | IVendorEntity| IAdminEntity | null>;
}