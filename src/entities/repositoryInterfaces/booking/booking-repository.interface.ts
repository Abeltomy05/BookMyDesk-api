import { FilterQuery } from "mongoose";
import { IBookingModel } from "../../../frameworks/database/mongo/models/booking.model";
import { IBaseRepository } from "../base-repository.interface";
import { IGetAdminBookingsFilterDTO, IGetAdminBookingsResultDTO } from "../../../shared/dtos/booking.dto";
import { RevenueChartDataDTO } from "../../../shared/dtos/revenue-report.dto";

export interface IBookingRepository extends IBaseRepository<IBookingModel>{
  findAllWithDetails(
    filter: FilterQuery<IBookingModel>,
    skip?: number,
    limit?: number,
    sort?: Record<string, 1 | -1>,
    role?: 'client' | 'vendor'
  ): Promise<{
    items: IBookingModel[]; 
    total: number;
  }>;

  findOneWithDetails(filter: FilterQuery<IBookingModel>):Promise<IBookingModel | null>;

 getAdminBookings(filters: IGetAdminBookingsFilterDTO): Promise<IGetAdminBookingsResultDTO>;

 getMonthlyBookingStats(): Promise<{ month: string; totalBookings: number; totalRevenue: number }[]>;

 findBookings(
    filter: FilterQuery<IBookingModel>,
    skip?: number,
    limit?: number,
    sort?: Record<string, 1 | -1>,
    role?: 'client' | 'vendor'
): Promise<{
    items: IBookingModel[]; 
    total: number;
  }>

  getRevenueByHour(userId: string, date: string, isAdmin: boolean): Promise<RevenueChartDataDTO[]>;
  getRevenueByDay(userId: string, month: string, year: string, isAdmin: boolean): Promise<RevenueChartDataDTO[]>;
  getRevenueByMonth(userId: string, year: string, isAdmin: boolean): Promise<RevenueChartDataDTO[]>;
}