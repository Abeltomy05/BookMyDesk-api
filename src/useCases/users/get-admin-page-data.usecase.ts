import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { MonthlyBookingStatsDTO } from "../../shared/types/booking.types";
import { IMonthlyBookingStats } from "../../entities/usecaseInterfaces/users/get-monthly-booking-stats-usecase.interface";

@injectable()
export class MonthlyBookingStats implements IMonthlyBookingStats{
    constructor(
      @inject("IBookingRepository")
      private _bookingRepo: IBookingRepository,
    ){}

    async execute():Promise<MonthlyBookingStatsDTO[]>{
       const monthlyStats = await this._bookingRepo.getMonthlyBookingStats();

        return  monthlyStats ;
    }
}