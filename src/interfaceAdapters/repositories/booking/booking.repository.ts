import { injectable } from "tsyringe";
import { BookingModel, IBookingModel } from "../../../frameworks/database/mongo/models/booking.model";
import { BaseRepository } from "../base.repository";
import { FilterQuery, Types } from "mongoose";
import { IBookingRepository } from "../../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IGetAdminBookingsFilterDTO } from "../../../shared/dtos/booking.dto";

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
    .populate('spaceId', 'name pricePerDay') 

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

async findOneWithDetails(filter: FilterQuery<IBookingModel>) {
  const query = this.model
    .findOne(filter)
    .populate('buildingId', 'buildingName location')
    .populate('spaceId', 'name pricePerDay')

  return await query.lean();
}

async getAdminBookings({
  page = 1,
  limit = 10,
  vendorId,
  buildingId,
  status,
}: IGetAdminBookingsFilterDTO) {
  const skip = (page - 1) * limit;

  const match: Record<string, any> = {};
  if (vendorId) match.vendorId = new Types.ObjectId(vendorId);
  if (buildingId) match.buildingId = new Types.ObjectId(buildingId);
  if (status) match.status = status;

  const pipeline: any[] = [
    { $match: match },

    {
      $lookup: {
        from: "clients",
        localField: "clientId",
        foreignField: "_id",
        as: "client",
      },
    },
    { $unwind: "$client" },

    {
      $lookup: {
        from: "vendors",
        localField: "vendorId",
        foreignField: "_id",
        as: "vendor",
      },
    },
    { $unwind: "$vendor" },

    {
      $lookup: {
        from: "buildings",
        localField: "buildingId",
        foreignField: "_id",
        as: "building",
      },
    },
    { $unwind: "$building" },

    {
      $lookup: {
        from: "spaces",
        localField: "spaceId",
        foreignField: "_id",
        as: "space",
      },
    },
    { $unwind: "$space" },

    {
      $project: {
        _id: 1,
        bookingDate: 1,
        totalPrice: 1,
        status: 1,

        clientName: "$client.username",
        clientEmail: "$client.email",

        vendorName: "$vendor.companyName",
        vendorEmail: "$vendor.email",

        buildingName: "$building.buildingName",
        spaceName: "$space.name",
      },
    },
    { $sort: { bookingDate: -1 } },
    { $skip: skip },
    { $limit: limit }
  ];

  const [bookings, total] = await Promise.all([
    this.model.aggregate(pipeline),
    this.model.countDocuments(match),
  ]);

  return {
    bookings,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

}