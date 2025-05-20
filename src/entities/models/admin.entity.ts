import { AdminStatus } from "../../shared/types/types";
import { IUserEntity } from "./user.entity";

export interface IAdminEntity extends IUserEntity{
    status: AdminStatus;
}