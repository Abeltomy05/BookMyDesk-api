import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IBookingEntityWithDetails } from "../../shared/dtos/booking.dto";
import { IGetBookingDetailsUseCase } from "../../entities/usecaseInterfaces/booking/single-booking-details-usecase.interface";
import { toEntityBookingWithDetails } from "../../interfaceAdapters/mappers/booking.mapper";


@injectable()
export class GetBookingDetailsUseCase implements IGetBookingDetailsUseCase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository
  ) {}

  async execute(bookingId: string): Promise<IBookingEntityWithDetails> {
    if (!bookingId) {
      throw new Error("Booking ID is required to fetch booking details.");
    }

    const bookingDetails = await this._bookingRepository.findOneWithDetails({_id:bookingId});
    
    if (!bookingDetails) {
      throw new Error("Booking not found.");
    }

    return toEntityBookingWithDetails(bookingDetails);
  }
}