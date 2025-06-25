import { FilterQuery } from "mongoose";
import { IBookingModel } from "../../../frameworks/database/mongo/models/booking.model";
import { IBaseRepository } from "../base-repository.interface";

export interface IBookingRepository extends IBaseRepository<IBookingModel>{
  findAllWithDetails(
    filter: FilterQuery<IBookingModel>,
    skip?: number,
    limit?: number,
    sort?: Record<string, 1 | -1>,
    role?: 'client' | 'vendor'
  ): Promise<{
    items: IBookingModel[]; 
    total: number;
  }>;
}