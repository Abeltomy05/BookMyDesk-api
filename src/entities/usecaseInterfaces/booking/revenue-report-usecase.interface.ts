import { RevenueReportBooking, RevenueReportFilters } from "../../../shared/dtos/revenue-report.dto";

export interface IRevenueReportUseCase{
     execute(data: RevenueReportFilters): Promise<RevenueReportBooking[]> 
}