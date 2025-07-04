import { Document, model, ObjectId } from 'mongoose';
import { vendorSchema } from '../schemas/vendor.schema';
import { IVendorEntity } from "../../../../entities/models/vendor.entity";

export interface IVendorModel extends Omit<IVendorEntity,'_id'>, Document {
    _id: ObjectId;
}

export const VendorModel = model<IVendorModel>('Vendor', vendorSchema);
