import { VendorStatus } from "../../shared/types/types";
import { IUserEntity } from "./user.entity";

export interface IVendorEntity extends IUserEntity{
  googleId?: string;
  companyName: string;
  companyAddress: string;
  banner?: string;
  description?: string;
  status: VendorStatus;
}