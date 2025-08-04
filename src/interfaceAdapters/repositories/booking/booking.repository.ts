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

  const match: Record<string, any> = {
    status: { $ne: "failed" }, 
  };
  if (vendorId) match.vendorId = new Types.ObjectId(vendorId);
  if (buildingId) match.buildingId = new Types.ObjectId(buildingId);
  if (status && status !== 'all') match.status = status;

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
        bookingId:1,
        bookingDates: 1,
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

async getMonthlyBookingStats(): Promise<{ month: string; totalBookings: number; totalRevenue: number }[]>{
  return this.model.aggregate([
    {
      $match:{
        status: "completed",
      }
    },
    {
      $group:{
        _id: {
          year: {$year: "$bookingDate"},
          month: { $month: "$bookingDate" },
        },
        totalBookings: {$sum: 1},
        totalRevenue: {$sum: {$ifNull: ["$totalPrice",0]}},
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
     {
      $project: {
        _id: 0,
        month: {
          $concat: [
            { $toString: "$_id.year" },
            "-",
            {
              $cond: [
                { $lt: ["$_id.month", 10] },
                { $concat: ["0", { $toString: "$_id.month" }] },
                { $toString: "$_id.month" },
              ],
            },
          ],
        },
        totalBookings: 1,
        totalRevenue: 1,
      },
    },
  ])
}

async findBookings(
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

  let query = this.model.find(filter);

  query = query
    .populate('buildingId', 'buildingName location')
    .populate('spaceId', 'name pricePerDay');

  if (role === 'vendor') {
    query = query.populate('clientId', 'username email phone');
  }

  query = query.sort(sort).skip(skip).limit(limit);

  const [items, total] = await Promise.all([
    query as Promise<any[]>,
    this.model.countDocuments(filter)
  ]);

  return { items, total };
}

async getRevenueByHour(userId: string, date: string, isAdmin: boolean) {
  const start = new Date(date);
  const end = new Date(date);
  end.setDate(end.getDate() + 1);

  const data = await this.model.aggregate([
    { $unwind: "$bookingDates" },
    {
      $match: {
        bookingDates: { $gte: start, $lt: end },
        status: "completed",
        ...(isAdmin ? {} : { vendorId: new Types.ObjectId(userId) })
      }
    },
    {
      $group: {
        _id: { $hour: "$bookingDates" },
        revenue: { $sum: "$totalPrice" },
        bookings: { $sum: 1 }
      }
    },
    {
      $project: {
        hour: { $concat: [{ $toString: "$_id" }, ":00"] },
        revenue: 1,
        bookings: 1,
        _id: 0
      }
    },
    { $sort: { hour: 1 } }
  ]);

  return data;
}

async getRevenueByDay(userId: string, month: string, year: string, isAdmin: boolean) {
  const start = new Date(`${year}-${month}-01`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  const data = await this.model.aggregate([
    { $unwind: "$bookingDates" },
    {
      $match: {
        bookingDates: { $gte: start, $lt: end },
        status: "completed",
        ...(isAdmin ? {} : { vendorId: new Types.ObjectId(userId) })
      }
    },
    {
      $group: {
        _id: { $dayOfMonth: "$bookingDates" },
        revenue: { $sum: "$totalPrice" },
        bookings: { $sum: 1 }
      }
    },
    {
      $project: {
        date: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: {
              $dateFromParts: {
                year: parseInt(year),
                month: parseInt(month),
                day: "$_id"
              }
            }
          }
        },
        revenue: 1,
        bookings: 1,
        _id: 0
      }
    },
    { $sort: { date: 1 } }
  ]);
  return data;
}

async getRevenueByMonth(userId: string, year: string, isAdmin: boolean) {
  const start = new Date(`${year}-01-01`);
  const end = new Date(`${parseInt(year) + 1}-01-01`);

  const data = await this.model.aggregate([
      { $unwind: "$bookingDates" },
      {
        $match: {
          bookingDates: { $gte: start, $lt: end },
          status: "completed",
          ...(isAdmin ? {} : { vendorId: new Types.ObjectId(userId) })
        }
      },
      {
        $group: {
          _id: { $month: "$bookingDates" },
          revenue: { $sum: "$totalPrice" },
          bookings: { $sum: 1 }
        }
      },
      {
        $project: {
          month: {
            $arrayElemAt: [
              ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              { $subtract: ["$_id", 1] }
            ]
          },
          revenue: 1,
          bookings: 1,
          _id: 0
        }
      },
      { $sort: { month: 1 } }
  ]);

  return data;
}

}