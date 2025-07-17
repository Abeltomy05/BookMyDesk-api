import { MonthlyBookingStatsDTO } from "../../../shared/dtos/types/booking.types";

export interface IMonthlyBookingStats{
    execute():Promise<MonthlyBookingStatsDTO[]>;
}