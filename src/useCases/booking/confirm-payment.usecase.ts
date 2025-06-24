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
        console.log("Payment Intent retrieved:", paymentIntent);

        if (paymentIntent.status !== 'requires_capture') {
            throw new Error('Payment intent is not in the correct state for confirmation');
        }
 
            const spaceId = paymentIntent.metadata.spaceId;
            const buildingId = paymentIntent.metadata.buildingId;
            const clientId = paymentIntent.metadata.clientId;
            const vendorId = paymentIntent.metadata.vendorId;
            const bookingDate = paymentIntent.metadata.bookingDate;
            const numberOfDesks = parseInt(paymentIntent.metadata.numberOfDesks);
            const totalPrice = parseFloat(paymentIntent.metadata.totalPrice);
            
             const space = await this._spaceRepository.findOne({_id: spaceId});
                if (!space) {
                    await this._stripeService.cancelPaymentIntent(data.paymentIntentId);

                    const failedBookingData = {
                        spaceId: new Types.ObjectId(spaceId),
                        clientId: new Types.ObjectId(clientId),
                        vendorId: new Types.ObjectId(vendorId),
                        buildingId: new Types.ObjectId(buildingId),
                        bookingDate: new Date(bookingDate),
                        numberOfDesks: numberOfDesks,
                        totalPrice: totalPrice,
                        status: 'failed' as BookingStatus,
                        paymentStatus: 'failed' as PaymentStatus,
                        paymentMethod: 'stripe' as PaymentMethod,
                        transactionId: data.paymentIntentId,
                    }; 
                    await this._bookingRepository.save(failedBookingData);
                    throw new Error('Space not found');
                }

             if (!space.isAvailable) {
                await this._stripeService.cancelPaymentIntent(data.paymentIntentId);
                 const failedBookingData = {
                    spaceId: new Types.ObjectId(spaceId),
                    clientId: new Types.ObjectId(clientId),
                    vendorId: new Types.ObjectId(vendorId),
                    buildingId: new Types.ObjectId(buildingId),
                    bookingDate: new Date(bookingDate),
                    numberOfDesks: numberOfDesks,
                    totalPrice: totalPrice,
                    status: 'failed' as BookingStatus,
                    paymentStatus: 'failed' as PaymentStatus,
                    paymentMethod: 'stripe' as PaymentMethod,
                    transactionId: data.paymentIntentId,
                };
                await this._bookingRepository.save(failedBookingData);
                throw new Error('Space is no longer available');
            }
            
             if (!space.capacity || space.capacity < numberOfDesks) {
                await this._stripeService.cancelPaymentIntent(data.paymentIntentId);
                 const failedBookingData = {
                        spaceId: new Types.ObjectId(spaceId),
                        clientId: new Types.ObjectId(clientId),
                        vendorId: new Types.ObjectId(vendorId),
                        buildingId: new Types.ObjectId(buildingId),
                        bookingDate: new Date(bookingDate),
                        numberOfDesks: numberOfDesks,
                        totalPrice: totalPrice,
                        status: 'failed' as BookingStatus,
                        paymentStatus: 'failed' as PaymentStatus,
                        paymentMethod: 'stripe' as PaymentMethod,
                        transactionId: data.paymentIntentId,
                    };
                await this._bookingRepository.save(failedBookingData);
                throw new Error(`Insufficient capacity. Only ${space.capacity || 0} desks available`);
            }

            const capturedPayment = await this._stripeService.capturePaymentIntent(data.paymentIntentId);

             if (capturedPayment.status !== 'succeeded') {

                    const failedBookingData = {
                        spaceId: new Types.ObjectId(spaceId),
                        clientId: new Types.ObjectId(clientId),
                        vendorId: new Types.ObjectId(vendorId),
                        buildingId: new Types.ObjectId(buildingId),
                        bookingDate: new Date(bookingDate),
                        numberOfDesks: numberOfDesks,
                        totalPrice: totalPrice,
                        status: 'failed' as BookingStatus,
                        paymentStatus: 'failed' as PaymentStatus,
                        paymentMethod: 'stripe' as PaymentMethod,
                        transactionId: data.paymentIntentId,
                    };
                await this._bookingRepository.save(failedBookingData);    
                throw new Error('Failed to capture payment');
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
            spaceId: new Types.ObjectId(spaceId),
            clientId: new Types.ObjectId(clientId),
            vendorId: new Types.ObjectId(vendorId),
            buildingId: new Types.ObjectId(buildingId),
            bookingDate: new Date(bookingDate),
            numberOfDesks: numberOfDesks,
            totalPrice: totalPrice,
            status: 'confirmed' as BookingStatus,
            paymentStatus: 'succeeded' as PaymentStatus,
            paymentMethod: 'stripe' as PaymentMethod,
            transactionId: data.paymentIntentId
        };

        const newBooking = await this._bookingRepository.save(bookingData);

         if (!newBooking) {
              await this._spaceRepository.update(
                { _id: spaceId },
                { 
                    capacity: space.capacity,
                }  
            );
            throw new Error('Failed to create booking');
        }

        return {
            success: true,
           data: {
                booking: newBooking,
                bookingId: newBooking._id.toString(),
                paymentStatus: 'succeeded',
                transactionId: data.paymentIntentId
            }
        };
       } catch (error: any) {
            console.error("Error confirming payment:", error);
             return {
                success: false,
                message: error.message || "Something went wrong while confirming payment."
            };
       } 
    }
}