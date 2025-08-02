import { container } from "tsyringe";
import { ClientRepository } from "../../interfaceAdapters/repositories/users/client.repository";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { VendorRepository } from "../../interfaceAdapters/repositories/users/vendor.repository";
import { IAdminRepository } from "../../entities/repositoryInterfaces/users/admin-repository.interface";
import { AdminRepository } from "../../interfaceAdapters/repositories/users/admin.repository";
import { OtpRepository } from "../../interfaceAdapters/repositories/auth/otp.repository";
import { RedisTokenRepository } from "../../interfaceAdapters/repositories/redis/redis-token.repository";
import { RefreshTokenRepository } from "../../interfaceAdapters/repositories/auth/refresh-token.repository";
import { BuildingRepository } from "../../interfaceAdapters/repositories/building/building.repository";
import { SpaceRepository } from "../../interfaceAdapters/repositories/building/space.repository";
import { BookingRepository } from "../../interfaceAdapters/repositories/booking/booking.repository";
import { WalletRepository } from "../../interfaceAdapters/repositories/wallet/wallet.repository";
import { WalletTransactionRepository } from "../../interfaceAdapters/repositories/wallet/walletTransaction.repository";
import { OfferRepository } from "../../interfaceAdapters/repositories/offer/offer.repository";
import { NotificationRepository } from "../../interfaceAdapters/repositories/notification/notification.repository";
import { ChatMessageRepository } from "../../interfaceAdapters/repositories/chat/chat-message.repository";
import { ChatSessionRepository } from "../../interfaceAdapters/repositories/chat/chat-session.repository";
import { AmenityRepository } from "../../interfaceAdapters/repositories/building/amenity.repository";

export class RepositoryRegistry{
    static registerRepositories():void{
         //* ====== Register Repositories ====== *//

        container.register<IClientRepository>("IClientRepository", {
            useClass: ClientRepository,
        }) 
         container.register<IVendorRepository>("IVendorRepository", {
            useClass: VendorRepository,
        }) 
         container.register<IAdminRepository>("IAdminRepository", {
            useClass: AdminRepository,
        }) 
        container.register("IOtpRepository",{
            useClass: OtpRepository
        })
        container.register("IRedisTokenRepository", {
            useClass: RedisTokenRepository
        })
        container.register("IRefreshTokenRepository", {
            useClass: RefreshTokenRepository
        })
        container.register("IBuildingRepository",{
            useClass: BuildingRepository
        })
        container.register("ISpaceRepository",{
            useClass: SpaceRepository,
        })
        container.register("IBookingRepository",{
            useClass: BookingRepository
        })
        container.register("IWalletRepository", {
            useClass: WalletRepository
        })
        container.register("IWalletTransactionRepository", {
            useClass: WalletTransactionRepository
        })
        container.register("IOfferRepository",{
            useClass: OfferRepository
        })
        container.register("INotificationRepository",{
            useClass: NotificationRepository
        })
        container.register("IChatMessageRepository",{
            useClass: ChatMessageRepository
        })
        container.register("IChatSessionRepository",{
            useClass: ChatSessionRepository
        })
        container.register("IAmenityRepository",{
            useClass: AmenityRepository
        })
        
    }
}