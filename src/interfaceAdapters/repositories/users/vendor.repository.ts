import { injectable } from "tsyringe";
import { IVendorRepository } from "../../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IVendorModel, VendorModel } from "../../../frameworks/database/mongo/models/vendor.model";
import { BaseRepository } from "../base.repository";

@injectable()
export class VendorRepository extends BaseRepository<IVendorModel> implements IVendorRepository {
    constructor(){
        super(VendorModel)
    }
}