import { MonthlyBookingStatsDTO } from "../../../shared/types/booking.types";

export interface IMonthlyBookingStats{
    execute():Promise<MonthlyBookingStatsDTO[]>;
}