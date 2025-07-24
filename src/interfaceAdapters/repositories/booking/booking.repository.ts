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
        bookingId:1,
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
){
   let searchTerm = '';
    if (role === 'vendor' && filter.search) {
        searchTerm = filter.search;
        delete filter.search;
    }

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

     if (role === 'vendor' && searchTerm) {
        const searchRegex = new RegExp(searchTerm, 'i');

       const pipeline = [
            { $match: filter },
            {
                $lookup: {
                    from: 'buildings', 
                    localField: 'buildingId',
                    foreignField: '_id',
                    as: 'buildingId'
                }
            },
            {
                $lookup: {
                    from: 'users', 
                    localField: 'clientId', 
                    foreignField: '_id',
                    as: 'clientId'
                }
            },
            {
                $lookup: {
                    from: 'spaces', 
                    localField: 'spaceId',
                    foreignField: '_id', 
                    as: 'spaceId'
                }
            },
            {
                $match: {
                    $or: [
                        { 'buildingId.buildingName': { $regex: searchRegex } },
                        { 'clientId.username': { $regex: searchRegex } }
                    ]
                }
            },
            { $unwind: { path: '$buildingId', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$clientId', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$spaceId', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    bookingDate: 1,
                    numberOfDesks: 1,
                    totalPrice: 1,
                    discountAmount: 1,
                    status: 1,
                    paymentStatus: 1,
                    paymentMethod: 1,
                    transactionId: 1,
                    cancellationReason: 1,
                    cancelledBy: 1,
                    vendorId: 1,
                    createdAt: 1,
                    updatedAt: 1,

                    'buildingId._id': 1,
                    'buildingId.buildingName': 1,
                    'buildingId.location': 1,

                    'spaceId._id': 1,
                    'spaceId.name': 1,
                    'spaceId.pricePerDay': 1,

                    'clientId._id': 1,
                    'clientId.username': 1,
                    'clientId.email': 1,
                    'clientId.phone': 1,
                }
            },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit }
        ];  

         const [items, totalResult] = await Promise.all([
            this.model.aggregate(pipeline),
            this.model.aggregate([
                { $match: filter },
                {
                    $lookup: {
                        from: 'buildings',
                        localField: 'buildingId',
                        foreignField: '_id',
                        as: 'buildingId'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'clientId',
                        foreignField: '_id',
                        as: 'clientId'
                    }
                },
                 { $unwind: { path: '$buildingId', preserveNullAndEmptyArrays: true } },
                 { $unwind: { path: '$clientId', preserveNullAndEmptyArrays: true } },
                 { $unwind: { path: '$spaceId', preserveNullAndEmptyArrays: true } },
                {
                    $match: {
                        $or: [
                            { 'buildingId.buildingName': { $regex: searchRegex } },
                            { 'clientId.username': { $regex: searchRegex } }
                        ]
                    }
                },
                { $count: 'total' }
            ])
        ]);

        const total = totalResult[0]?.total || 0;
        return { items, total }; 
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
}