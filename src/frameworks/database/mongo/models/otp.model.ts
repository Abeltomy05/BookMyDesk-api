import { model, ObjectId } from "mongoose";
import { IOtpEntity } from "../../../../entities/models/otp.entity";
import { otpSchema } from "../schemas/otp.schema";

export interface IOtpModel extends IOtpEntity, Document {
     _id: ObjectId;
}

export const OtpModel = model<IOtpModel>("Otp", otpSchema);