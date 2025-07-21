import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { FilterQuery } from "mongoose";
import { IBookingEntity } from "../../entities/models/booking.entity";
import { IRevenueReportUseCase } from "../../entities/usecaseInterfaces/booking/revenue-report-usecase.interface";

export interface RevenueReportFilters {
  vendorId: string;
  buildingId: string;
}

export interface RevenueReportBooking {
  bookingId: string;
  clientId: { _id: string,username: string };
  spaceId: { _id: string,name: string };
  buildingId: { _id: string,buildingName: string };
  totalPrice?: number;
  numberOfDesks?: number;
  bookingDate: Date;
  paymentMethod?: string;
}

type PopulatedBooking = Omit<IBookingEntity, 'clientId' | 'spaceId' | 'buildingId'> & {
  clientId: { _id: string; username: string };
  spaceId: { _id: string; name: string };
  buildingId: { _id: string; buildingName: string };
};

@injectable()
export class RevenueReportUseCase implements IRevenueReportUseCase{
    constructor(
      @inject("IBookingRepository")
      private _bookingRepo: IBookingRepository
    ){}

async execute(data: RevenueReportFilters): Promise<RevenueReportBooking[]> {
  const { vendorId, buildingId } = data;

  if (!buildingId || !vendorId) {
    throw new Error("Missing credentials for getting the revenue data.");
  }

  const filter: FilterQuery<IBookingEntity> = {
    vendorId,
    status: "completed",
  };

  if (buildingId !== "all") {
    filter.buildingId = buildingId;
  }

  const populatedBookings = await this._bookingRepo.findWithPopulate(
    filter,
    [
      { path: "clientId", select: "username" },
      { path: "spaceId", select: "name" },
      { path: "buildingId", select: "buildingName" },
    ]
  ) as unknown as PopulatedBooking[];

  return populatedBookings.map((booking) => ({
    bookingId: booking._id.toString(),
    clientId: {
      _id: booking.clientId._id.toString(),
      username: booking.clientId.username,
    },
    spaceId: {
      _id: booking.spaceId._id.toString(),
      name: booking.spaceId.name,
    },
    buildingId: {
      _id: booking.buildingId._id.toString(),
      buildingName: booking.buildingId.buildingName,
    },
    totalPrice: booking.totalPrice,
    numberOfDesks: booking.numberOfDesks,
    bookingDate: booking.bookingDate,
    paymentMethod: booking.paymentMethod,
  }));
}

}