import { IVendorModel } from "../../../frameworks/database/mongo/models/vendor.model";
import { IBaseRepository } from "../base-repository.interface";

export interface IVendorRepository extends IBaseRepository<IVendorModel> {
 getNamesAndCount(): Promise<{ names: { _id: string; companyName: string }[]; count: number }>
}