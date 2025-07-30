import { RevenueChartDataDTO } from "../../../shared/dtos/revenue-report.dto";

export interface IRevenueChartDataUseCase {
    execute(params:{userId: string;role: string;filterType: 'date' | 'month' | 'year';date?: string;month?: string;year: string;}): Promise<RevenueChartDataDTO[]>
}