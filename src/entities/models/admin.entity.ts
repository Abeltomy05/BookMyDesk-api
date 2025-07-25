import { AdminStatus } from "../../shared/dtos/types/user.types";
import { IUserEntity } from "./user.entity";

export interface IAdminEntity extends IUserEntity{
    status: AdminStatus;
}