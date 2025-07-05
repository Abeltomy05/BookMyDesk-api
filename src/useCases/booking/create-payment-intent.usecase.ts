import { inject, injectable } from "tsyringe";
import { Types } from "mongoose";
import { CreatePaymentIntentDTO, CreatePaymentIntentResponse } from "../../shared/dtos/booking.dto";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { ICreatePaymentIntentUseCase } from "../../entities/usecaseInterfaces/booking/create-payment-intent-usecase.interface";
import { IStripeService } from "../../entities/serviceInterfaces/stripe-service.interface";
import { ISpaceRepository } from "../../entities/repositoryInterfaces/building/space-repository.interface";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { BookingStatus, PaymentMethod, PaymentStatus } from "../../shared/types/types";

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
            throw new Error('Space not found');
        }

        const building = await this._buildingRepository.findOne({ _id: space.buildingId });
        if (!building) {
         throw new Error('Building not found for the space');
        }

      if (data.bookingId) {
        const existingBooking = await this._bookingRepository.findOne({
          _id: new Types.ObjectId(data.bookingId),
          clientId: new Types.ObjectId(data.clientId),
          status: { $in: ['failed', 'cancelled'] } 
        });

         if (!existingBooking) {
          throw new Error('Invalid booking ID or booking cannot be retried');
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
                bookingDate: new Date(data.bookingDate).toISOString(),
                numberOfDesks: (data.numberOfDesks ?? 1).toString(),
                totalPrice: (data.amount / 100).toString(),
                discountAmount: (data.discountAmount || 0).toString(),
                bookingId: data.bookingId || '',
            },
            description: `Booking payment for ${data.numberOfDesks || 1} desk(s)`,
        });


       return {
        clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id,
        publishableKey: process.env.STRIPE_PUBLIC_KEY!
      };
       } catch (error: any) {
      console.error('Error in CreatePaymentIntentUseCase:', error);
      throw new Error(error.message || 'Failed to create payment intent');
    }
    }
}