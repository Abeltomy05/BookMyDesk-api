import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IGetBookingsUseCase } from "../../entities/usecaseInterfaces/booking/get-booking-usecase.interface";
import { IGetBookingsDTO, IGetBookingsResult } from "../../shared/dtos/booking.dto";
import {  toEntityBookingWithDetails } from "../../interfaceAdapters/mappers/booking.mapper";
import { Types } from "mongoose";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { convertISTDateToUTC } from "../../shared/helper/dateFormatter";
import { ERROR_MESSAGES } from "../../shared/constants";


@injectable()
export class GetBookingsUseCase implements IGetBookingsUseCase {
    constructor(
        @inject("IBookingRepository")
        private _bookingRepository: IBookingRepository
    ) {}

    async execute(params: IGetBookingsDTO): Promise<IGetBookingsResult> {
        const { userId, role, page, limit, status, buildingId, fromDate, toDate } = params;
        if (!userId || !role) {
            throw new CustomError(ERROR_MESSAGES.ID_ROLE_REQUIRED,StatusCodes.BAD_REQUEST);
        }

        const filterCriteria: any = {};

         if (role === 'client') {
        filterCriteria.clientId = new Types.ObjectId(userId);
        } else if (role === 'vendor') {
        filterCriteria.vendorId = new Types.ObjectId(userId);
        } else {
        throw new CustomError(ERROR_MESSAGES.INVALID_ROLE, StatusCodes.BAD_REQUEST);
        }

         if (status) {
            filterCriteria.status = status;
        }

        if (buildingId) {
            filterCriteria.buildingId = new Types.ObjectId(buildingId);
        }

        if (fromDate || toDate) {
            const dateFilter: { $gte?: Date; $lte?: Date } = {};

            if (fromDate) dateFilter.$gte = convertISTDateToUTC(fromDate, false);
            if (toDate) dateFilter.$lte = convertISTDateToUTC(toDate, true);
            filterCriteria.bookingDates = { $elemMatch: dateFilter };
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