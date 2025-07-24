import { ClientStatus } from "../../shared/dtos/types/user.types";
import { IUserEntity } from "./user.entity";

export interface IClientEntity extends IUserEntity {
  googleId?: string;
  walletBalance?: number;
  status: ClientStatus;
  location?: {
    type?: string;
    name?: string;
    displayName?: string;
    zipCode?: string;
    coordinates?: number[];
   };
}