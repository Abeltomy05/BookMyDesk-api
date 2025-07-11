import { inject, injectable } from "tsyringe";
import { ISpaceRepository } from "../../entities/repositoryInterfaces/building/space-repository.interface";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/wallet-repository.interface";
import { IWalletTransactionRepository } from "../../entities/repositoryInterfaces/wallet/walletTrasaction-repository.interface";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { Types } from "mongoose";
import { IPayWithWalletUseCase } from "../../entities/usecaseInterfaces/wallet/pay-with-wallet-usecase.interface";
import { INotificationService } from "../../entities/serviceInterfaces/notification-service.interface";

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

       if (!space) throw new Error("Space not found.");
       if (!space.isAvailable) throw new Error("Space is no longer available.");
       if(!space.capacity || space.capacity < numberOfDesks){
         throw new Error(`Insufficient capacity. Only ${space.capacity || 0} desks available`);
       }

       const building = await this._buildingRepository.findOne({ _id: space.buildingId });
       if (!building) throw new Error("Building not found for this space.");

       const vendorId = building.vendorId;

        const wallet = await this._walletRepository.findOne({ userId }, { balance: 1 });
        if (!wallet || wallet.balance < totalPrice) {
            throw new Error("Insufficient wallet balance.");
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

        const updatedSpace = await this._spaceRepository.update(
            { _id: spaceId, capacity: { $gte: numberOfDesks }, isAvailable: true },
            { $inc: { capacity: -numberOfDesks } }
        );
        if (!updatedSpace) throw new Error("Failed to update space capacity.");


         const booking = await this._bookingRepository.save({
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
            await this._spaceRepository.update(
                { _id: spaceId },
                { $inc: { capacity: numberOfDesks } }
            );
            throw new Error("Failed to create booking.");
         }

         if (building.summarizedSpaces) {
            const index = building.summarizedSpaces.findIndex(s => s.name === space.name);
            if (index !== -1) {
                const summarizedSpaces = [...building.summarizedSpaces];
                summarizedSpaces[index].count = Math.max(0, summarizedSpaces[index].count - numberOfDesks);

                await this._buildingRepository.update(
                    { _id: building._id },
                    { summarizedSpaces }
                );
            }
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

        const adminId = process.env.ADMIN_ID;
        if (!adminId) {
            throw new Error("Admin ID not configured in environment");
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