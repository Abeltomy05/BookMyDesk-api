import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IGetBookingsUseCase } from "../../entities/usecaseInterfaces/booking/get-booking-usecase.interface";
import { IGetBookingsDTO, IGetBookingsResult } from "../../shared/dtos/booking.dto";
import {  toEntityBookingWithDetails } from "../../interfaceAdapters/mappers/booking.mapper";
import { Types } from "mongoose";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";


@injectable()
export class GetBookingsUseCase implements IGetBookingsUseCase {
    constructor(
        @inject("IBookingRepository")
        private _bookingRepository: IBookingRepository
    ) {}

    async execute(params: IGetBookingsDTO): Promise<IGetBookingsResult> {
        const { userId, role, page, limit, search, status } = params;
        if (!userId || !role) {
            throw new CustomError("User ID and role is required to fetch bookings.",StatusCodes.BAD_REQUEST);
        }

        const filterCriteria: any = {};

         if (role === 'client') {
        filterCriteria.clientId = new Types.ObjectId(userId);
        } else if (role === 'vendor') {
        filterCriteria.vendorId = new Types.ObjectId(userId);
        } else {
        throw new CustomError("Invalid role. Only 'client' and 'vendor' roles are supported.", StatusCodes.BAD_REQUEST);
        }

         if (status) {
            filterCriteria.status = status;
        }

        if (search && role === 'vendor') {
            filterCriteria.search = search; 
        }

        const skip = (page - 1) * limit; 

        const result  = await this._bookingRepository.findBookings(filterCriteria, skip, limit, { createdAt: -1 },role);
         if (result.total === 0) {
            return {
                bookings: [],
                totalItems: 0,
                totalPages: 0,
            };
        }
        const totalPages = Math.ceil(result.total / limit);
        const bookings = result.items.map(toEntityBookingWithDetails);
         return {
            bookings,
            totalItems: result.total,
            totalPages,
        };
    }
}