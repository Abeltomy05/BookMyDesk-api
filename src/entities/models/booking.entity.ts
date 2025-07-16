import { BookingStatus, PaymentMethod, PaymentStatus } from "../../shared/types/user.types";

export interface IBookingEntity{
    _id: string;
    spaceId: string;
    clientId: string;
    vendorId: string;
    buildingId: string;
    
    bookingDate: Date;
    numberOfDesks?: number;
    totalPrice?: number;
    discountAmount?: number
    cancellationReason?: string;
    cancelledBy?: "vendor" | "client";
    
    status?: BookingStatus;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    
    transactionId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}