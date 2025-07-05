import { ClientStatus } from "../../shared/types/types";
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