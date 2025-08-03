import { IBookingEntity } from "../../entities/models/booking.entity";

export interface RevenueReportFilters {
  vendorId: string;
  buildingId: string;
  filterType?: 'date' | 'month' | 'year';
  date?: string; 
  month?: string;
  year?: string; 
}

export interface RevenueReportBooking {
  bookingId: string;
  clientId: { _id: string,username: string };
  spaceId: { _id: string,name: string };
  buildingId: { _id: string,buildingName: string };
  totalPrice?: number;
  numberOfDesks?: number;
  bookingDates: Date[];
  paymentMethod?: string;
}

//admin revenue report 
export interface AdminRevenueReportDTO extends RevenueReportBooking {
   adminRevenue: number;
}

export type PopulatedBooking = Omit<IBookingEntity, 'clientId' | 'spaceId' | 'buildingId'> & {
  clientId: { _id: string; username: string };
  spaceId: { _id: string; name: string };
  buildingId: { _id: string; buildingName: string };
};

// revenue chart data
export type RevenueChartDataDTO = {
  month?: string;
  date?: string;
  revenue: number;
  bookings: number;
};