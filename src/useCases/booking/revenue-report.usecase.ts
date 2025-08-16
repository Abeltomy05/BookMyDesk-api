import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { FilterQuery } from "mongoose";
import { IBookingEntity } from "../../entities/models/booking.entity";
import { IRevenueReportUseCase } from "../../entities/usecaseInterfaces/booking/revenue-report-usecase.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { PopulatedBooking, RevenueReportBooking, RevenueReportFilters } from "../../shared/dtos/revenue-report.dto";
import { ERROR_MESSAGES } from "../../shared/constants";


@injectable()
export class RevenueReportUseCase implements IRevenueReportUseCase{
    constructor(
      @inject("IBookingRepository")
      private _bookingRepo: IBookingRepository
    ){}

async execute(data: RevenueReportFilters): Promise<RevenueReportBooking[]> {
  const { vendorId, buildingId, filterType, date, month, year } = data;

  if (!buildingId || !vendorId) {
    throw new CustomError(ERROR_MESSAGES.MISSING_CREDENTIALS,StatusCodes.BAD_REQUEST);
  }

  const filter: FilterQuery<IBookingEntity> = {
    vendorId,
    status: ["completed","confirmed"],
  };

  if (buildingId !== "all") {
    filter.buildingId = buildingId;
  }

if (filterType === 'date' && date) {
  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);

  const nextDate = new Date(selectedDate);
  nextDate.setDate(selectedDate.getDate() + 1);

  filter.bookingDates = { $elemMatch: { $gte: selectedDate, $lt: nextDate } };
}

if (filterType === 'month' && month && year) {
  const startDate = new Date(`${year}-${month}-01`);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1);

  filter.bookingDates = { $elemMatch: { $gte: startDate, $lt: endDate } };
}

if (filterType === 'year' && year) {
  const startDate = new Date(`${year}-01-01`);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(`${+year + 1}-01-01`);
  endDate.setHours(0, 0, 0, 0);

  filter.bookingDates = { $elemMatch: { $gte: startDate, $lt: endDate } };
}

  const populatedBookings = await this._bookingRepo.findWithPopulate(
    filter,
    [
      { path: "clientId", select: "username" },
      { path: "spaceId", select: "name" },
      { path: "buildingId", select: "buildingName" },
    ],
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
    bookingDates: booking.bookingDates,
    paymentMethod: booking.paymentMethod,
  }));
}

}