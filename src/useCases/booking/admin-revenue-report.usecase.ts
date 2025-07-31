import { FilterQuery } from "mongoose";
import { AdminRevenueReportDTO, PopulatedBooking } from "../../shared/dtos/revenue-report.dto";
import { IBookingEntity } from "../../entities/models/booking.entity";
import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { admin } from "../../shared/config/firebaseAdmin";
import { IAdminRevenueReportUseCase } from "../../entities/usecaseInterfaces/booking/admin-revenue-report-usecase.interface";

@injectable()
export class AdminRevenueReportUseCase implements IAdminRevenueReportUseCase {
    constructor(
      @inject("IBookingRepository")
      private _bookingRepo: IBookingRepository
    ){}

    async execute(params:{
        filterType?: 'date' | 'month' | 'year';
        date?: string;
        month?: string;
        year?: string;
    }):Promise<{totalAdminRevenue:number;bookings:AdminRevenueReportDTO[]}>{
      const { filterType, date, month, year } = params;

      const filter: FilterQuery<IBookingEntity> = {
          status: "completed",
      };

 if (filterType === 'date' && date) {
     const selectedDate = new Date(date);
     selectedDate.setHours(0, 0, 0, 0);

     const nextDate = new Date(selectedDate);
     nextDate.setDate(selectedDate.getDate() + 1);

     filter.bookingDate = { $gte: selectedDate, $lt: nextDate };
  }

  if (filterType === 'month' && month && year) {
    const startDate = new Date(`${year}-${month}-01`);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
    filter.bookingDate = { $gte: startDate, $lt: endDate };
  }

  if (filterType === 'year' && year) {
    const startDate = new Date(`${year}-01-01`);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(`${+year + 1}-01-01`);
    endDate.setHours(0, 0, 0, 0);
    filter.bookingDate = { $gte: startDate, $lt: endDate };
  }

  const populatedBookings = await this._bookingRepo.findWithPopulate(
      filter,
      [
        { path: "clientId", select: "username" },
        { path: "spaceId", select: "name" },
        { path: "buildingId", select: "buildingName" },
      ]
     ) as unknown as PopulatedBooking[];

   const reportData = populatedBookings.map((booking) => {
    const adminRevenue = booking.totalPrice ? booking.totalPrice * 0.05 : 0;

    return {
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
        adminRevenue,
      };
    });

    const totalAdminRevenue = reportData.reduce((acc, curr) => acc + curr.adminRevenue, 0);
    return {
        totalAdminRevenue,
        bookings: reportData
    };
    }
}