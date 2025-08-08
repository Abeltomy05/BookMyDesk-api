import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IBookingEntityWithDetails } from "../../shared/dtos/booking.dto";
import { IGetBookingDetailsUseCase } from "../../entities/usecaseInterfaces/booking/single-booking-details-usecase.interface";
import { toEntityBookingWithDetails } from "../../interfaceAdapters/mappers/booking.mapper";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { ERROR_MESSAGES } from "../../shared/constants";


@injectable()
export class GetBookingDetailsUseCase implements IGetBookingDetailsUseCase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository
  ) {}

  async execute(bookingId: string): Promise<IBookingEntityWithDetails> {
    if (!bookingId) {
      throw new CustomError(ERROR_MESSAGES.BOOKING_ID_REQUIRED,StatusCodes.BAD_REQUEST);
    }

    const bookingDetails = await this._bookingRepository.findOneWithDetails({_id:bookingId});
    
    if (!bookingDetails) {
      throw new CustomError(ERROR_MESSAGES.BOOKING_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    return toEntityBookingWithDetails(bookingDetails);
  }
}