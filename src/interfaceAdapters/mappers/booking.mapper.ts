import { IBookingEntity } from "../../entities/models/booking.entity";
import { IBookingModel } from "../../frameworks/database/mongo/models/booking.model";
import { Types } from "mongoose";
import { IBookingEntityWithDetails } from "../../shared/dtos/booking.dto";

export const toEntityBooking = (model: IBookingModel): IBookingEntity => ({
  _id: model._id.toString(),
  spaceId: model.spaceId.toString(),
  clientId: model.clientId.toString(),
  vendorId: model.vendorId.toString(),
  buildingId: model.buildingId.toString(),
  bookingDates: model.bookingDates, 
  numberOfDesks: model.numberOfDesks,
  totalPrice: model.totalPrice,
  status: model.status,
  paymentStatus: model.paymentStatus,
  paymentMethod: model.paymentMethod,
  transactionId: model.transactionId,
  createdAt: model.createdAt,
  updatedAt: model.updatedAt,
});

export const toModelBooking = (entity: IBookingEntity): Partial<IBookingModel> => ({
  spaceId: new Types.ObjectId(entity.spaceId),
  clientId: new Types.ObjectId(entity.clientId),
  vendorId: new Types.ObjectId(entity.vendorId),
  buildingId: new Types.ObjectId(entity.buildingId),
  bookingDates: entity.bookingDates,
  numberOfDesks: entity.numberOfDesks,
  totalPrice: entity.totalPrice,
  status: entity.status,
  paymentStatus: entity.paymentStatus,
  paymentMethod: entity.paymentMethod,
  transactionId: entity.transactionId,
});

// booking
export const toEntityBookingWithDetails = (model: any): IBookingEntityWithDetails => ({
  _id: model._id?.toString() ?? '',
  bookingId: model.bookingId,
  spaceId: model.spaceId
    ? typeof model.spaceId === 'object'
      ? model.spaceId._id?.toString() ?? ''
      : model.spaceId?.toString() ?? ''
    : '',
  clientId: model.clientId?._id?.toString() ?? model.clientId?.toString() ?? '',
  vendorId: model.vendorId?.toString() ?? '',
  buildingId: model.buildingId
    ? typeof model.buildingId === 'object'
      ? model.buildingId._id?.toString() ?? ''
      : model.buildingId?.toString() ?? ''
    : '',
  bookingDates: model.bookingDates,
  numberOfDesks: model.numberOfDesks,
  totalPrice: model.totalPrice,
  discountAmount: model.discountAmount,
  status: model.status,
  paymentStatus: model.paymentStatus,
  paymentMethod: model.paymentMethod,
  transactionId: model.transactionId,
  cancellationReason: model.cancellationReason,
  cancelledBy: model.cancelledBy,
  createdAt: model.createdAt,
  updatedAt: model.updatedAt,
  building: model.buildingId && typeof model.buildingId === 'object'
    ? {
        buildingName: model.buildingId.buildingName,
        location: model.buildingId.location,
      }
    : undefined,
  space: model.spaceId && typeof model.spaceId === 'object'
    ? {
        name: model.spaceId.name,
        pricePerDay: model.spaceId.pricePerDay,
      }
    : undefined,
  client: model.clientId && typeof model.clientId === 'object'
    ? {
        username: model.clientId.username,
        email: model.clientId.email,
        phone: model.clientId.phone,
      }
    : undefined,
});