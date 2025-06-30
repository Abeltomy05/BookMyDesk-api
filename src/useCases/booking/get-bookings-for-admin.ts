import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IGetAdminBookingsFilterDTO, IGetAdminBookingsResultDTO } from "../../shared/dtos/booking.dto";
import { IGetBookingsForAdmin } from "../../entities/usecaseInterfaces/booking/get-booking-for-admin-usecase.interface";

@injectable()
export class GetBookingsForAdmin implements IGetBookingsForAdmin{
    constructor(
    @inject("IBookingRepository")
    private _bookingRepository:IBookingRepository
    ){}

    async execute(data:IGetAdminBookingsFilterDTO): Promise<IGetAdminBookingsResultDTO>{
        return this._bookingRepository.getAdminBookings(data);
    }
}