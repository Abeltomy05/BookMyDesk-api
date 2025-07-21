import { RevenueReportBooking, RevenueReportFilters } from "../../../useCases/booking/revenue-report.usecase";

export interface IRevenueReportUseCase{
     execute(data: RevenueReportFilters): Promise<RevenueReportBooking[]> 
}