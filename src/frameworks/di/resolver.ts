import { container } from "tsyringe";
import { DependencyInjection } from "./index";
import { AuthController } from "../../interfaceAdapters/controllers/auth/auth.controller";
import { IAuthController } from "../../entities/controllerInterfaces/auth/auth-controller.interface";
import { IUsersController } from "../../entities/controllerInterfaces/others/users-controller.interface";
import { UsersController } from "../../interfaceAdapters/controllers/users.controller";
import { IVendorController } from "../../entities/controllerInterfaces/others/vendor-controller.interface";
import { VendorController } from "../../interfaceAdapters/controllers/vendor.controller";
import { BuildingController } from "../../interfaceAdapters/controllers/building.controller";
import { IBuildingController } from "../../entities/controllerInterfaces/others/building-controller.interface";
import { BlockStatusMiddleware } from "../../interfaceAdapters/middlewares/blockStatus.middleware";
import { BookingController } from "../../interfaceAdapters/controllers/booking.controller";
import { IBookingController } from "../../entities/controllerInterfaces/others/booking-controller.interface";
import { WalletController } from "../../interfaceAdapters/controllers/wallet.controller";
import { IWalletController } from "../../entities/controllerInterfaces/others/wallet-controller.interface";
import { IOfferController } from "../../entities/controllerInterfaces/others/offer-controller.interface";
import { OfferController } from "../../interfaceAdapters/controllers/offer.controller";
import { NotificationController } from "../../interfaceAdapters/controllers/notification.controller";
import { INotificationController } from "../../entities/controllerInterfaces/others/notification-controller.interface";

DependencyInjection.registerAll();
//* ====== Middleware Resolving ====== *//
export const blockStatusMiddleware = container.resolve(BlockStatusMiddleware)

//* ====== Controller Resolving ====== *//
export const authController = 
            container.resolve<IAuthController>(AuthController);

export const usersController =
            container.resolve<IUsersController>(UsersController);

export const vendorController =
            container.resolve<IVendorController>(VendorController);    
            
export const buildingController = 
            container.resolve<IBuildingController>(BuildingController);  

export const bookingController = 
            container.resolve<IBookingController>(BookingController);
export const walletController = 
            container.resolve<IWalletController>(WalletController);                       
export const offerController = 
            container.resolve<IOfferController>(OfferController);  
export const notifiactionController = 
            container.resolve<INotificationController>(NotificationController);                    
//* ====== Socket Handler Resolving ====== *//            
