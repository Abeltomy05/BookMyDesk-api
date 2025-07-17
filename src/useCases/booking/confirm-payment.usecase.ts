import { inject, injectable } from "tsyringe";
import { Types } from "mongoose";
import { IConfirmPaymentUseCase } from "../../entities/usecaseInterfaces/booking/confirm-payment-usecase.interface";
import { ConfirmPaymentDTO } from "../../shared/dtos/booking.dto";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IStripeService } from "../../entities/serviceInterfaces/stripe-service.interface";
import { BookingStatus, PaymentMethod, PaymentStatus } from "../../shared/dtos/types/user.types";
import { ISpaceRepository } from "../../entities/repositoryInterfaces/building/space-repository.interface";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/wallet-repository.interface";
import { IWalletTransactionRepository } from "../../entities/repositoryInterfaces/wallet/walletTrasaction-repository.interface";
import { INotificationService } from "../../entities/serviceInterfaces/notification-service.interface";
import { INotificationRepository } from "../../entities/repositoryInterfaces/notification/notification-repository.interface";
import { getErrorMessage } from "../../shared/error/errorHandler";
import { config } from "../../shared/config";

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
       @inject("IWalletRepository")
       private _walletRepository: IWalletRepository,
       @inject("IWalletTransactionRepository")
       private _walletTransactionRepository: IWalletTransactionRepository,
       @inject("INotificationService")
       private _notificationService: INotificationService,
    ){}


    private async handleFailedBooking(metadata:{
        bookingId?: string;
        spaceId: string;
        clientId: string;
        vendorId: string;
        buildingId: string;
        bookingDate: string;
        numberOfDesks: number;
        totalPrice: number;
        discountAmount?: number;
        paymentIntentId: string;
    }){
        const {
          bookingId, spaceId, clientId, vendorId, buildingId,
          bookingDate, numberOfDesks, totalPrice, discountAmount, paymentIntentId,
        } = metadata;

         if (bookingId) {
            const updated = await this._bookingRepository.update(
                { _id: new Types.ObjectId(bookingId) },
                {
                    status: 'failed' as BookingStatus,
                    paymentStatus: 'failed' as PaymentStatus,
                    transactionId: paymentIntentId,
                    cancellationReason: '',
                }
            );
            if (!updated) {
                console.warn(`Failed to update retry booking ${bookingId} to failed`);
            }
        }else {
        await this._bookingRepository.save({
            spaceId: new Types.ObjectId(spaceId),
            clientId: new Types.ObjectId(clientId),
            vendorId: new Types.ObjectId(vendorId),
            buildingId: new Types.ObjectId(buildingId),
            bookingDate: new Date(bookingDate),
            numberOfDesks,
            totalPrice,
            discountAmount: discountAmount || 0,
            status: 'failed' as BookingStatus,
            paymentStatus: 'failed' as PaymentStatus,
            paymentMethod: 'stripe' as PaymentMethod,
            transactionId: paymentIntentId,
        });
    }
    }

    async execute(data: ConfirmPaymentDTO){
       try {
        const paymentIntent = await this._stripeService.retrievePaymentIntent(data.paymentIntentId);

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
            const discountAmount = parseFloat(paymentIntent.metadata.discountAmount) || 0; 
            const bookingId = paymentIntent.metadata.bookingId;
            
             const space = await this._spaceRepository.findOne({_id: spaceId});
                if (!space) {
                    await this._stripeService.cancelPaymentIntent(data.paymentIntentId);
                      await this.handleFailedBooking({
                            bookingId,
                            spaceId,
                            clientId,
                            vendorId,
                            buildingId,
                            bookingDate,
                            numberOfDesks,
                            totalPrice,
                            discountAmount,
                            paymentIntentId: data.paymentIntentId,
                        });
                        throw new Error('Space not found');
                }

             if (!space.isAvailable) {
                await this._stripeService.cancelPaymentIntent(data.paymentIntentId);
                 await this.handleFailedBooking({
                            bookingId,
                            spaceId,
                            clientId,
                            vendorId,
                            buildingId,
                            bookingDate,
                            numberOfDesks,
                            totalPrice,
                            discountAmount,
                            paymentIntentId: data.paymentIntentId,
                  });
                throw new Error('Space is no longer available');
            }
            
             if (!space.capacity || space.capacity < numberOfDesks) {
                await this._stripeService.cancelPaymentIntent(data.paymentIntentId);
                 await this.handleFailedBooking({
                            bookingId,
                            spaceId,
                            clientId,
                            vendorId,
                            buildingId,
                            bookingDate,
                            numberOfDesks,
                            totalPrice,
                            discountAmount,
                            paymentIntentId: data.paymentIntentId,
                    });
                throw new Error(`Insufficient capacity. Only ${space.capacity || 0} desks available`);
            }

            const updatedSpace = await this._spaceRepository.update(
                {
                    _id: spaceId,
                    capacity: { $gte: numberOfDesks },
                    isAvailable: true
                },
                {
                    $inc: { capacity: -numberOfDesks }
                },
                );

             if (!updatedSpace) {
                await this.handleFailedBooking({
                    bookingId,
                    spaceId,
                    clientId,
                    vendorId,
                    buildingId,
                    bookingDate,
                    numberOfDesks,
                    totalPrice,
                    discountAmount,
                    paymentIntentId: data.paymentIntentId,
                });
                throw new Error('Failed to update space capacity');
            }

            const capturedPayment = await this._stripeService.capturePaymentIntent(data.paymentIntentId);

             if (capturedPayment.status !== 'succeeded') {

                 await this._spaceRepository.update(
                        { _id: spaceId },
                        { $inc: { capacity: numberOfDesks } }
                 );

                await this._stripeService.refundPaymentIntent(data.paymentIntentId);
         
                    await this.handleFailedBooking({
                            bookingId,
                            spaceId,
                            clientId,
                            vendorId,
                            buildingId,
                            bookingDate,
                            numberOfDesks,
                            totalPrice,
                            discountAmount,
                            paymentIntentId: data.paymentIntentId,
                     });   
                throw new Error('Failed to capture payment');
            }

            //processing vendor amount and platform fee
            const platformFee = Math.round(totalPrice * 0.05);
            const vendorAmount = totalPrice - platformFee;

            const vendorWalletResult = await this._walletRepository.updateOrCreateWalletBalance(vendorId, 'Vendor', vendorAmount);

            await this._walletTransactionRepository.save({
                walletId: new Types.ObjectId(vendorWalletResult.wallet._id),
                type: 'booking-income',
                amount: vendorAmount,
                description: `Booking income for booking via Stripe (Amount: ${vendorAmount})`,
                balanceBefore: vendorWalletResult.balanceBefore,
                balanceAfter: vendorWalletResult.balanceAfter,
            });

            const adminId = config.ADMIN_ID;
            if (!adminId) {
                throw new Error("Admin ID not configured in environment");
            }
            const adminWalletResult = await this._walletRepository.updateOrCreateWalletBalance(adminId, 'Admin', platformFee);

            await this._walletTransactionRepository.save({
                walletId: new Types.ObjectId(adminWalletResult.wallet._id),
                type: 'platform-fee',
                amount: platformFee,
                description: `Platform fee for booking via Stripe (5%)`,
                balanceBefore: adminWalletResult.balanceBefore,
                balanceAfter: adminWalletResult.balanceAfter,
            });


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

        if (bookingId) {
            const existingBooking = await this._bookingRepository.findOne({
                _id: new Types.ObjectId(bookingId),
                clientId: new Types.ObjectId(clientId),
            });   

            if (!existingBooking) {
                throw new Error('Booking not found for update');
            }

            const updatedBooking = await this._bookingRepository.update(
                { _id: existingBooking._id },
                {
                    status: 'confirmed' as BookingStatus,
                    paymentStatus: 'succeeded' as PaymentStatus,

                    numberOfDesks: numberOfDesks,
                    totalPrice: totalPrice,
                    discountAmount: discountAmount,
                    bookingDate: new Date(bookingDate),
                    transactionId: data.paymentIntentId,
                    paymentMethod: 'stripe' as PaymentMethod,
                    cancellationReason:"",
                }
            );
   
            if (!updatedBooking) {
                await this._spaceRepository.update(
                    { _id: spaceId },
                    { $inc: { capacity: numberOfDesks } }
                );
                throw new Error('Failed to update existing booking');
            }

             return {
                success: true,
                data: {
                    booking: updatedBooking,
                    bookingId: updatedBooking._id.toString(),
                    paymentStatus: 'succeeded',
                    transactionId: data.paymentIntentId,
                    isRetry: true
                }
            };
        }else{

        const bookingData = {
            spaceId: new Types.ObjectId(spaceId),
            clientId: new Types.ObjectId(clientId),
            vendorId: new Types.ObjectId(vendorId),
            buildingId: new Types.ObjectId(buildingId),
            bookingDate: new Date(bookingDate),
            numberOfDesks: numberOfDesks,
            totalPrice: totalPrice,
            discountAmount: discountAmount,
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



         await this._notificationService.sendToUser(
            vendorId.toString(), 'vendor', 
            'New Booking Received!', 
            `You received a booking for ${space.name} in ${building?.buildingName}. Total: ₹${totalPrice}`,
             {
                bookingId: newBooking._id.toString(),
                buildingName: building?.buildingName || "",
                spaceName: space.name,
                type: 'success'
             }
        )

         await this._notificationService.saveNotification(
            vendorId.toString(), 'Vendor',
            'New Booking Received!',
            `You received a booking for ${space.name} in ${building?.buildingName}. Total: ₹${totalPrice}`,
            {
                bookingId: newBooking._id.toString(),
                buildingName: building?.buildingName || "",
                spaceName: space.name,
            }
        );

        await this._notificationService.sendToUser(
             adminId, 'admin', 
            'Platform Fee Collected!', 
            `A new booking was made for ${space.name} in ${building?.buildingName}. Platform fee earned: ₹${platformFee}`,
             {
                bookingId: newBooking._id.toString(),
                buildingName: building?.buildingName || "",
                spaceName: space.name,
                type: 'success'
             }
        )

        await this._notificationService.saveNotification(
            adminId, 'Admin',
            'Platform Fee Collected!',
            `A new booking was made for ${space.name} in ${building?.buildingName}. Platform fee earned: ₹${platformFee}`,
            {
                bookingId: newBooking._id.toString(),
                buildingName: building?.buildingName || "",
                spaceName: space.name,
            }
        );

        return {
            success: true,
           data: {
                booking: newBooking,
                bookingId: newBooking._id.toString(),
                paymentStatus: 'succeeded',
                transactionId: data.paymentIntentId,
                isRetry: false
            }
        };
    }
       } catch (error: unknown) {
            console.error("Error confirming payment:", error);
            const message = getErrorMessage(error)
             return {
                success: false,
                message: message || "Something went wrong while confirming payment."
            };
       } 
    }
}