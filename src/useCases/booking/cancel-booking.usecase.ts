import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/wallet-repository.interface";
import { IWalletTransactionRepository } from "../../entities/repositoryInterfaces/wallet/walletTrasaction-repository.interface";
import mongoose, { Types } from 'mongoose';
import { ICancelBookingUseCase } from "../../entities/usecaseInterfaces/booking/cancel-booking-usecase.interface";

@injectable()
export class CancelBookingUseCase implements ICancelBookingUseCase {
    constructor(
        @inject("IBookingRepository")
        private _bookingRepository: IBookingRepository,
        @inject("IWalletRepository")
        private _walletRepository: IWalletRepository,
        @inject("IWalletTransactionRepository")
        private _walletTransactionRepository: IWalletTransactionRepository,
    ){}

    async execute(bookingId: string, reason:string, userId:string, role:string): Promise<{ success: boolean}> {
         const booking = await this._bookingRepository.findOne({_id:bookingId});
        if(!booking) {
            throw new Error("Booking not found");
        }

        if(booking.status === "cancelled") {
            throw new Error("Booking is already cancelled");
        }

        //refund
         const refundAmount = booking.totalPrice ?? 0;
         let wallet = await this._walletRepository.findOne({userId:booking.clientId,role:'Client'});

         let balanceBefore = 0;
         let balanceAfter = 0;

          if (!wallet) {
                balanceBefore = 0;
                balanceAfter = refundAmount;

                wallet = await this._walletRepository.save({
                userId: new Types.ObjectId(booking.clientId),
                role: 'Client',
                balance: balanceAfter,
             });
            } else {
                balanceBefore = wallet.balance;
                balanceAfter = balanceBefore + refundAmount;

                await this._walletRepository.update({_id:wallet._id}, {
                    balance: balanceAfter,
                });
            }


        // Create wallet transaction

        await this._walletTransactionRepository.save({
            walletId: wallet._id,
            type: "refund",
            amount: refundAmount,
            description: `Refund for booking ${bookingId}`,
            balanceBefore: balanceBefore,
            balanceAfter: balanceAfter,
        });

        // Update booking status to cancelled and payment status to refunded
        await this._bookingRepository.update({_id:bookingId}, {
            status: "cancelled",
            paymentStatus: "refunded",
            cancellationReason: reason,
        });

         return { success: true };
    }
}