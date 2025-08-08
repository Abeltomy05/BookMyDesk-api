import { inject, injectable } from "tsyringe";
import { Types } from "mongoose";
import { CreatePaymentIntentDTO, CreatePaymentIntentResponse } from "../../shared/dtos/booking.dto";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { ICreatePaymentIntentUseCase } from "../../entities/usecaseInterfaces/booking/create-payment-intent-usecase.interface";
import { IStripeService } from "../../entities/serviceInterfaces/stripe-service.interface";
import { ISpaceRepository } from "../../entities/repositoryInterfaces/building/space-repository.interface";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { getErrorMessage } from "../../shared/error/errorHandler";
import { config } from "../../shared/config";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { ERROR_MESSAGES } from "../../shared/constants";

@injectable()
export class CreatePaymentIntentUseCase implements ICreatePaymentIntentUseCase{
    constructor(
        @inject("IBookingRepository")
        private _bookingRepository: IBookingRepository,
        @inject("IStripeService")
        private _stripeService: IStripeService,
        @inject("ISpaceRepository")
        private _spaceRepository: ISpaceRepository,
        @inject("IBuildingRepository")
        private _buildingRepository: IBuildingRepository,
    ){}

    async execute(data: CreatePaymentIntentDTO): Promise<CreatePaymentIntentResponse> {
         try {
        const space = await this._spaceRepository.findOne({_id:data.spaceId});
        if (!space) {
            throw new CustomError(ERROR_MESSAGES.SPACE_NOT_FOUND,StatusCodes.NOT_FOUND);
        }

        const building = await this._buildingRepository.findOne({ _id: space.buildingId });
        if (!building) {
         throw new CustomError(ERROR_MESSAGES.BUILDING_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

      if (data.bookingId) {
        const existingBooking = await this._bookingRepository.findOne({
          _id: new Types.ObjectId(data.bookingId),
          clientId: new Types.ObjectId(data.clientId),
          status: { $in: ['failed', 'cancelled'] } 
        });

         if (!existingBooking) {
          throw new CustomError(ERROR_MESSAGES.INVALID_BOOKING_ID, StatusCodes.BAD_REQUEST);
        }
      }
      const paymentIntent = await this._stripeService.createPaymentIntent({
            amount: data.amount, 
            currency: data.currency,
            capture_method: 'manual',
            metadata: {
                spaceId: data.spaceId,
                clientId: data.clientId,
                vendorId: building.vendorId.toString(),
                buildingId: space.buildingId.toString(),
                bookingDates: JSON.stringify(data.bookingDates.map(date => new Date(date).toISOString())),
                numberOfDesks: (data.numberOfDesks ?? 1).toString(),
                totalPrice: (data.amount / 100).toString(),
                discountAmount: (data.discountAmount || 0).toString(),
                bookingId: data.bookingId || '',
            },
            description: `Booking payment for ${data.numberOfDesks || 1} desk(s) on ${data.bookingDates.length} date(s)`
        });


       return {
        clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id,
        publishableKey: config.STRIPE_PUBLIC_KEY!
      };
       } catch (error: unknown) {
        const message = getErrorMessage(error)
      console.error('Error in CreatePaymentIntentUseCase:', error);
      throw new CustomError(message || ERROR_MESSAGES.FAILED, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    }
}