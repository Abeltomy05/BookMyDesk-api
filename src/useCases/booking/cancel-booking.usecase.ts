import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/wallet-repository.interface";
import { IWalletTransactionRepository } from "../../entities/repositoryInterfaces/wallet/walletTrasaction-repository.interface";
import mongoose, { Types } from 'mongoose';
import { ICancelBookingUseCase } from "../../entities/usecaseInterfaces/booking/cancel-booking-usecase.interface";
import { ISpaceRepository } from "../../entities/repositoryInterfaces/building/space-repository.interface";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";

@injectable()
export class CancelBookingUseCase implements ICancelBookingUseCase {
    constructor(
        @inject("IBookingRepository")
        private _bookingRepository: IBookingRepository,
        @inject("IWalletRepository")
        private _walletRepository: IWalletRepository,
        @inject("IWalletTransactionRepository")
        private _walletTransactionRepository: IWalletTransactionRepository,
        @inject("ISpaceRepository")
        private _spaceRepository: ISpaceRepository,
        @inject("IBuildingRepository")
        private _buildingRepository: IBuildingRepository,
    ){}

    async execute(bookingId: string, reason:string, userId:string, role:'client' | 'vendor'): Promise<{ success: boolean}> {
         const booking = await this._bookingRepository.findOne({_id:bookingId});
        if(!booking) {
            throw new Error("Booking not found");
        }

        if(booking.status === "cancelled") {
            throw new Error("Booking is already cancelled");
        }

        if (role === 'client' && booking.clientId.toString() !== userId) {
          throw new Error("You are not allowed to cancel this booking.");
        }

        if (role === 'vendor' && booking.vendorId.toString() !== userId) {
          throw new Error("You are not allowed to cancel this booking.");
        }



        //refund
        const totalPrice =  booking.totalPrice || 0;
        const platformFee = Math.round(totalPrice * 0.05);
        const refundAmount = totalPrice - platformFee;

       const vendorWalletResult = await this._walletRepository.updateOrCreateWalletBalance(
         booking.vendorId.toString(),
         'Vendor',
         -refundAmount
        );

       await this._walletTransactionRepository.save({
        walletId: new Types.ObjectId(vendorWalletResult.wallet._id),
        type: "booking-refund",
        amount: -refundAmount,
        description: `Deducted for cancellation of booking ${bookingId}`,
        balanceBefore: vendorWalletResult.balanceBefore,
        balanceAfter: vendorWalletResult.balanceAfter,
       }); 

       const clientWalletResult = await this._walletRepository.updateOrCreateWalletBalance(
            booking.clientId.toString(),
            'Client',
            refundAmount
        );

       await this._walletTransactionRepository.save({
            walletId: new Types.ObjectId(clientWalletResult.wallet._id),
            type: "refund",
            amount: refundAmount,
            description: `95% refund for booking ${bookingId}`,
            balanceBefore: clientWalletResult.balanceBefore,
            balanceAfter: clientWalletResult.balanceAfter,
        }); 

        // Update booking status to cancelled and payment status to refunded
        await this._bookingRepository.update({_id:bookingId}, {
            status: "cancelled",
            paymentStatus: "refunded",
            cancellationReason: reason,
            cancelledBy: role,
        });

        if (booking.spaceId && booking.numberOfDesks) {
            const space = await this._spaceRepository.findOne({_id:booking.spaceId});
            if (space && typeof space.capacity === 'number') {
                await this._spaceRepository.update(
                    {_id: space._id}, 
                    { $inc: { capacity: booking.numberOfDesks } }    
                );
                console.log(`[Space Capacity Restored] Space ${space._id} updated `);
            }
        }

        if (booking.buildingId && booking.spaceId && typeof booking.numberOfDesks === 'number') {
            const numberOfDesks = booking.numberOfDesks;
            const building = await this._buildingRepository.findOne({_id: booking.buildingId});
            const space = await this._spaceRepository.findOne({_id: booking.spaceId});

            if (building && space && building.summarizedSpaces && space.name) {
                const updatedSummarizedSpaces = building.summarizedSpaces.map(s => {
                    if (s.name === space.name) {
                        return {
                            ...s,
                            count: s.count + numberOfDesks
                        };
                    }
                    return s;
                });

                await this._buildingRepository.update(
                    {_id: building._id}, 
                    {summarizedSpaces: updatedSummarizedSpaces}
                );

                console.log(`[Building Summary Updated] ${booking.buildingId} → ${space.name} count increased by ${booking.numberOfDesks}`);
            }
        }

        console.log(`[Booking Cancelled] by ${role}(${userId}) for booking ${bookingId}`);

         return { success: true };
    }
}