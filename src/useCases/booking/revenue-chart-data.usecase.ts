import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { RevenueChartDataDTO } from "../../shared/dtos/revenue-report.dto";
import { IRevenueChartDataUseCase } from "../../entities/usecaseInterfaces/booking/revenue-chart-data-usecase.interface";
import { convertISTDateToUTC } from "../../shared/helper/dateFormatter";
import { ERROR_MESSAGES } from "../../shared/constants";

@injectable()
export class RevenueChartDataUseCase implements IRevenueChartDataUseCase {
    constructor(
     @inject("IBookingRepository")
     private _bookingRepo: IBookingRepository,
    ){}

    async execute(params:{userId: string;role: string;filterType: 'date' | 'month' | 'year';date?: string;month?: string;year: string;}): Promise<RevenueChartDataDTO[]>{
         const { userId,role, filterType, date, month, year } = params;
            if (!userId || !role || !filterType) {
                throw new Error(ERROR_MESSAGES.MISSING_CREDENTIALS);
            }
         const isAdmin = role === 'admin';

         switch (filterType) {
            case 'date':
            let utcDate = convertISTDateToUTC(date!);    
            return await this._bookingRepo.getRevenueByHour(userId, utcDate.toString(),isAdmin);
            case 'month':
            return await this._bookingRepo.getRevenueByDay(userId, month!, year,isAdmin);
            case 'year':
            return await this._bookingRepo.getRevenueByMonth(userId, year,isAdmin);
            default:
            return [];
         }
    }
}