import { injectable } from "tsyringe";
import { BaseRepository } from "../base.repository";
import { AmenityModel, IAmenityModel } from "../../../frameworks/database/mongo/models/amenity.model";
import { IAmenityEntity } from "../../../entities/models/amenity.entity";
import { IAmenityRepository } from "../../../entities/repositoryInterfaces/building/amenity-repository.interface";

@injectable()
export class AmenityRepository extends BaseRepository<IAmenityModel> implements IAmenityRepository{
   constructor(){
    super(AmenityModel)
   }

}