import { FilterQuery } from "mongoose";
import { IAmenityModel } from "../../../frameworks/database/mongo/models/amenity.model";
import { IBaseRepository } from "../base-repository.interface";

export interface IAmenityRepository extends IBaseRepository<IAmenityModel>{
   findWithPopulatePaginated<TReturn = IAmenityModel>(
       filter: FilterQuery<IAmenityModel>,
       populateFields: { path: string; select?: string }[],
       sort: Record<string, 1 | -1>,
       page: number,
       limit: number
     ): Promise<{ items: TReturn[]; totalItems: number }> 
}