import { inject, injectable } from "tsyringe";
import { Types } from "mongoose";
import { IConfirmPaymentUseCase } from "../../entities/usecaseInterfaces/booking/confirm-payment-usecase.interface";
import { ConfirmPaymentDTO } from "../../shared/dtos/booking.dto";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IStripeService } from "../../entities/serviceInterfaces/stripe-service.interface";
import { BookingStatus, PaymentMethod, PaymentStatus } from "../../shared/types/types";
import { ISpaceRepository } from "../../entities/repositoryInterfaces/building/space-repository.interface";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";

@injectable()
export class ConfirmPaymentUseCase implements IConfirmPaymentUseCase {
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

    async execute(data: ConfirmPaymentDTO): Promise<{}> {
       try {
        const paymentIntent = await this._stripeService.retrievePaymentIntent(data.paymentIntentId);
        if (paymentIntent.status === 'succeeded') {  
            const spaceId = paymentIntent.metadata.spaceId;
            const buildingId = paymentIntent.metadata.buildingId;
            const numberOfDesks = parseInt(paymentIntent.metadata.numberOfDesks);
            
             const space = await this._spaceRepository.findOne({_id: spaceId});
                if (!space) {
                    throw new Error('Space not found');
                }

             if (!space.isAvailable) {
                throw new Error('Space is no longer available');
            }
            
             if (!space.capacity || space.capacity < numberOfDesks) {
                throw new Error(`Insufficient capacity. Only ${space.capacity || 0} desks available`);
            }

            const newCapacity = space.capacity - numberOfDesks;
             const updatedSpace = await this._spaceRepository.update(
                { _id: spaceId },
                { 
                    capacity: newCapacity,
                }
             );

             if (!updatedSpace) {
                throw new Error('Failed to update space capacity');
            }

            const building = await this._buildingRepository.findOne({ _id: buildingId });
            if (building && building.summarizedSpaces) {
                const spaceIndex = building.summarizedSpaces.findIndex(
                    s => s.name === space.name
                );

                 if (spaceIndex !== -1) {
                    const updatedSummarizedSpaces = [...building.summarizedSpaces];
                    updatedSummarizedSpaces[spaceIndex] = {
                        ...updatedSummarizedSpaces[spaceIndex],
                        count: Math.max(0, updatedSummarizedSpaces[spaceIndex].count - numberOfDesks)
                    };

                    await this._buildingRepository.update(
                        { _id: buildingId },
                        { summarizedSpaces: updatedSummarizedSpaces }
                    );
                }
            }

            const bookingData = {
            spaceId: new Types.ObjectId(paymentIntent.metadata.spaceId),
            clientId: new Types.ObjectId(paymentIntent.metadata.clientId),
            vendorId: new Types.ObjectId(paymentIntent.metadata.vendorId),
            buildingId: new Types.ObjectId(paymentIntent.metadata.buildingId),
            bookingDate: new Date(paymentIntent.metadata.bookingDate),
            numberOfDesks: numberOfDesks,
            totalPrice: parseFloat(paymentIntent.metadata.totalPrice),
            status: 'confirmed' as BookingStatus,
            paymentStatus: 'succeeded' as PaymentStatus,
            paymentMethod: 'stripe' as PaymentMethod,
            transactionId: data.paymentIntentId
        };

        const newBooking = await this._bookingRepository.save(bookingData);

        return {
            success: true,
           data: {
                booking: newBooking,
                bookingId: newBooking._id.toString(),
            }
        };

        } else {
            throw new Error('Payment not successful');
        }
       } catch (error: any) {
            console.error("Error confirming payment:", error);
             return {
                success: false,
                message: error.message || "Something went wrong while confirming payment."
            };
       } 
    }
}