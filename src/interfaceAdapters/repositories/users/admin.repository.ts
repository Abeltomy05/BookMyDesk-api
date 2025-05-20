import { injectable } from "tsyringe";
import { IAdminRepository } from "../../../entities/repositoryInterfaces/users/admin-repository.interface";
import { AdminModel, IAdminModel } from "../../../frameworks/database/mongo/models/admin.model";
import { BaseRepository } from "../base.repository";

@injectable()
export class AdminRepository extends BaseRepository<IAdminModel> implements IAdminRepository{
   constructor(){
    super(AdminModel)
   }
}