import { injectable } from "tsyringe";
import { IVendorRepository } from "../../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IVendorModel, VendorModel } from "../../../frameworks/database/mongo/models/vendor.model";
import { BaseRepository } from "../base.repository";

@injectable()
export class VendorRepository extends BaseRepository<IVendorModel> implements IVendorRepository {
    constructor(){
        super(VendorModel)
    }

    async getNamesAndCount(): Promise<{ names: { _id: string; companyName: string }[]; count: number }> {
        const vendors = await VendorModel.find({}, { _id: 1, companyName: 1 }).lean();
        const mapped = vendors.map((v) => ({
            _id: v._id.toString(),
            companyName: v.companyName,
        }))
        return {
            names: mapped,
            count: mapped.length,
        }
    }
}