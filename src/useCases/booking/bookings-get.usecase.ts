import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IGetBookingsUseCase } from "../../entities/usecaseInterfaces/booking/get-booking-usecase.interface";
import { IGetBookingsDTO, IGetBookingsResult } from "../../shared/dtos/booking.dto";
import {  toEntityBookingWithDetails } from "../../interfaceAdapters/mappers/booking.mapper";
import { Types } from "mongoose";


@injectable()
export class GetBookingsUseCase implements IGetBookingsUseCase {
    constructor(
        @inject("IBookingRepository")
        private _bookingRepository: IBookingRepository
    ) {}

    async execute(params: IGetBookingsDTO): Promise<IGetBookingsResult> {
        const { userId, role, page, limit, search, status } = params;
        if (!userId || !role) {
            throw new Error("User ID and role is required to fetch bookings.");
        }

        const filterCriteria: any = {};

         if (role === 'client') {
        filterCriteria.clientId = new Types.ObjectId(userId);
        } else if (role === 'vendor') {
        filterCriteria.vendorId = new Types.ObjectId(userId);
        } else {
        throw new Error("Invalid role. Only 'client' and 'vendor' roles are supported.");
        }

         if (status) {
            filterCriteria.status = status;
        }

        if (search) {
       
        }

        const skip = (page - 1) * limit; 
        console.log('Filter criteria:', JSON.stringify(filterCriteria, null, 2));
        console.log('UserId type:', typeof userId, userId);
        const result  = await this._bookingRepository.findAllWithDetails(filterCriteria, skip, limit, { createdAt: -1 },role);
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