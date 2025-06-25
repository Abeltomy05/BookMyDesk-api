import { IBookingEntityWithDetails } from "../../../shared/dtos/booking.dto";

export interface IGetBookingDetailsUseCase{
    execute(bookingId: string): Promise<IBookingEntityWithDetails>;
}