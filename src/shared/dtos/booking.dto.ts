import { IBookingEntity } from "../../entities/models/booking.entity";

export interface CreatePaymentIntentDTO{
    amount: number;
    currency: string;
    spaceId: string;
    bookingDate: Date;
    numberOfDesks?: number; 
    clientId: string;
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
  search: string;
  status?: string;
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

