import { IBookingEntity } from "../../entities/models/booking.entity";

export interface CreatePaymentIntentDTO{
    amount: number;
    currency: string;
    spaceId: string;
    bookingDates: string[];
    numberOfDesks?: number; 
    clientId: string;
    discountAmount?: number;
    bookingId?: string;
}

export interface ConfirmPaymentDTO {
  paymentIntentId: string;
}


// Response type for the payment intent creation
export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  publishableKey: string;
}

//get bookings
export interface IGetBookingsDTO {
  userId: string;
  role: string;
  page: number;
  limit: number;
  status?: string;
  buildingId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface IGetBookingsResult {
  bookings: IBookingEntityWithDetails[];
  totalItems: number;
  totalPages: number;
}

export interface IBookingEntityWithDetails extends IBookingEntity {
  building?: {
      buildingName: string;
      location?: {
        type?: string;
        name?: string;
        displayName?: string;
        zipCode?: string;
        coordinates?: number[];
    };
  };
  space?: {
    name: string;
    pricePerDay: number;
  };
  client?: {
    username: string;
    email: string;
    phone: string;
  };
}

//admin booking

export interface IGetAdminBookingsFilterDTO {
  page?: number;
  limit?: number;
  vendorId?: string;
  buildingId?: string;
  status?: string;
  fromDate?:string;
  toDate?:string;
}


export interface IAdminBooking {
  _id: string;
  bookingDate: Date;
  totalPrice: number;
  status: string;
  clientName: string;
  clientEmail: string;
  vendorName: string;
  vendorEmail: string;
  buildingName: string;
  spaceName: string;
}

export interface IGetAdminBookingsResultDTO {
  bookings: IAdminBooking[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface VendorHomeDataResultDTO {
  totalBuildings: number;
  totalSpaces: number;
  completedBookingsCount: number;
  totalRevenue: number;
  completedBookings: IBookingEntityWithDetails[];
  buildingIdsAndName:{
    _id: string,
    name: string,
  }[];
}

