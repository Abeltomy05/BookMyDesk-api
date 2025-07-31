import { AdminRevenueReportDTO } from "../../../shared/dtos/revenue-report.dto";

export interface IAdminRevenueReportUseCase{
    execute(params:{
        filterType?: 'date' | 'month' | 'year';
        date?: string;
        month?: string;
        year?: string;
    }):Promise<{totalAdminRevenue:number;bookings:AdminRevenueReportDTO[]}>
}