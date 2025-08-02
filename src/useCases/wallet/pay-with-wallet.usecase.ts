import { inject, injectable } from "tsyringe";
import { ISpaceRepository } from "../../entities/repositoryInterfaces/building/space-repository.interface";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/wallet-repository.interface";
import { IWalletTransactionRepository } from "../../entities/repositoryInterfaces/wallet/walletTrasaction-repository.interface";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { Types } from "mongoose";
import { IPayWithWalletUseCase } from "../../entities/usecaseInterfaces/wallet/pay-with-wallet-usecase.interface";
import { INotificationService } from "../../entities/serviceInterfaces/notification-service.interface";
import { config } from "../../shared/config";
import { generateBookingId } from "../../shared/helper/generateBookingId";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";

@injectable()
export class PayWithWalletUseCase implements IPayWithWalletUseCase{
    constructor(
      @inject("ISpaceRepository")
      private _spaceRepository: ISpaceRepository,
      @inject("IBuildingRepository")
      private _buildingRepository: IBuildingRepository,
      @inject("IWalletRepository")
      private _walletRepository: IWalletRepository,
      @inject("IWalletTransactionRepository")
      private _walletTransactionRepository: IWalletTransactionRepository,
      @inject("IBookingRepository")
      private _bookingRepository: IBookingRepository,
      @inject("INotificationService")
      private _notificationService: INotificationService,
    ){}


    async execute(
        spaceId:string,
        bookingDate:Date,
        numberOfDesks:number,
        totalPrice:number,
        userId:string,
        discountAmount?: number
    ):Promise<{ success: boolean; bookingId: string }>{
       const space = await this._spaceRepository.findOne({_id:spaceId});

       if (!space) throw new CustomError("Space not found.",StatusCodes.NOT_FOUND);
       if (!space.isAvailable) throw new CustomError("Space is no longer available.",StatusCodes.BAD_REQUEST);
       
        const bookingsOnDate = await this._bookingRepository.find({
                spaceId: new Types.ObjectId(spaceId),
                bookingDate: new Date(bookingDate),
                status: 'confirmed',
                paymentStatus: 'succeeded'
        });

        const alreadyBookedDesks = bookingsOnDate.reduce((sum, booking) => {
                return sum + (booking.numberOfDesks || 0);
        }, 0);

        const availableDesks = space.capacity! - alreadyBookedDesks;

         if (availableDesks < numberOfDesks) {
            throw new CustomError(`Oops! Only ${availableDesks} desk(s) are available on that date. Try selecting fewer desks or pick another day.`, StatusCodes.BAD_REQUEST);
         }

       const building = await this._buildingRepository.findOne({ _id: space.buildingId });
       if (!building) throw new CustomError("Building not found for this space.", StatusCodes.NOT_FOUND);

       const vendorId = building.vendorId;

        const wallet = await this._walletRepository.findOne({ userId }, { balance: 1 });
        if (!wallet || wallet.balance < totalPrice) {
            throw new CustomError("Insufficient wallet balance.", StatusCodes.BAD_REQUEST);
        }

        const newBalance = wallet.balance - totalPrice;
        await this._walletRepository.update(wallet._id, { balance: newBalance });

        await this._walletTransactionRepository.save({
            walletId: wallet._id,
            type: 'payment',
            amount: totalPrice,
            description: 'Booking payment',
            balanceBefore: wallet.balance,
            balanceAfter: newBalance,
            createdAt: new Date(),
            updatedAt: new Date()
        });

         const booking = await this._bookingRepository.save({
            bookingId: generateBookingId(),
            spaceId: new Types.ObjectId(spaceId),
            clientId: new Types.ObjectId(userId),
            vendorId,
            buildingId: space.buildingId,
            bookingDate: new Date(bookingDate),
            numberOfDesks,
            totalPrice,
            discountAmount: discountAmount || 0,
            status: 'confirmed',
            paymentStatus: 'succeeded',
            paymentMethod: 'wallet',
            transactionId: 'wallet-' + Date.now()
         });

         if (!booking) {
            throw new CustomError("Failed to create booking.", StatusCodes.INTERNAL_SERVER_ERROR);
         }

        const platformFee = Math.round(totalPrice * 0.05);
        const vendorAmount = totalPrice - platformFee;
        
        const vendorWalletResult = await this._walletRepository.updateOrCreateWalletBalance(vendorId.toString(), 'Vendor', vendorAmount);
            await this._walletTransactionRepository.save({
            walletId: new Types.ObjectId(vendorWalletResult.wallet._id),
            type: 'booking-income',
            amount: vendorAmount,
            description: `Booking income from wallet payment (Amount: ${vendorAmount})`,
            balanceBefore: vendorWalletResult.balanceBefore,
            balanceAfter: vendorWalletResult.balanceAfter,
        });

        const adminId = config.ADMIN_ID;
        if (!adminId) {
            throw new CustomError("Admin ID not configured in environment", StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const adminWalletResult = await this._walletRepository.updateOrCreateWalletBalance(adminId, 'Admin', platformFee);
        await this._walletTransactionRepository.save({
            walletId: new Types.ObjectId(adminWalletResult.wallet._id),
            type: 'platform-fee',
            amount: platformFee,
            description: `Platform fee from wallet booking (5%)`,
            balanceBefore: adminWalletResult.balanceBefore,
            balanceAfter: adminWalletResult.balanceAfter,
        });

        await this._notificationService.sendToUser(
            vendorId.toString(), 'vendor', 
            'New Booking Received!', 
            `You received a booking for ${space.name} in ${building.buildingName}. Total: ₹${totalPrice}`,
             {
                bookingId: booking._id.toString(),
                buildingName: building.buildingName,
                spaceName: space.name,
                type: 'success'
             }
        )
        await this._notificationService.saveNotification(
            vendorId.toString(), 'Vendor', 
            'New Booking Received!', 
            `You received a booking for ${space.name} in ${building.buildingName}. Total: ₹${totalPrice}`,
             {
                bookingId: booking._id.toString(),
                buildingName: building.buildingName,
                spaceName: space.name,
             }
        )

        await this._notificationService.sendToUser(
            adminId,
            'admin',
            'Platform Fee Collected',
            `A new booking was made for ${space.name} in ${building.buildingName}. Platform fee earned: ₹${platformFee}`,
            {
                bookingId: booking._id.toString(),
                buildingName: building.buildingName,
                spaceName: space.name,
                type: 'success'
            }
        );
        await this._notificationService.saveNotification(
            adminId,
            'Admin',
            'Platform Fee Collected',
            `A new booking was made for ${space.name} in ${building.buildingName}. Platform fee earned: ₹${platformFee}`,
            {
                bookingId: booking._id.toString(),
                buildingName: building.buildingName,
                spaceName: space.name,
            }
        );

        return {
            success: true,
            bookingId: booking._id.toString()
        };
    }
}