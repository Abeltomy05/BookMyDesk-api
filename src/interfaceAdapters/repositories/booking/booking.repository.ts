import { injectable } from "tsyringe";
import { BookingModel, IBookingModel } from "../../../frameworks/database/mongo/models/booking.model";
import { BaseRepository } from "../base.repository";
import { FilterQuery } from "mongoose";
import { IBookingRepository } from "../../../entities/repositoryInterfaces/booking/booking-repository.interface";

@injectable()
export class BookingRepository extends BaseRepository<IBookingModel> implements IBookingRepository{
   constructor(){
    super(BookingModel)
   }
async findAllWithDetails(
  filter: FilterQuery<IBookingModel> = {},
  skip = 0,
  limit = 10,
  sort: Record<string, 1 | -1> = {},
  role?: 'client' | 'vendor'
) {
   if (role === 'vendor') {
    if (typeof filter.status === 'string' && filter.status.trim() !== '') {
    filter.status = {
      $eq: filter.status,
      $ne: 'failed'
    };
  } else {
    filter.status = { $ne: 'failed' };
  }
  }

  const query = this.model
    .find(filter)
    .populate('buildingId', 'buildingName location')
    .populate('spaceId', 'name') 

   if (role === 'vendor') {
    query.populate('clientId', 'username email phone');
  }  

  query.sort(sort).skip(skip).limit(limit).lean();

  const [items, total] = await Promise.all([
    query as Promise<any[]>,
    this.model.countDocuments(filter),
  ]);

  return { items, total };
}

}