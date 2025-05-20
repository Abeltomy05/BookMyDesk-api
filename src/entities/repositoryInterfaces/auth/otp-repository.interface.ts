import { IOtpEntity } from "../../models/otp.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IOtpRepository extends IBaseRepository<IOtpEntity>{
   findLatestOtp(email: string): Promise<IOtpEntity | null>;
}