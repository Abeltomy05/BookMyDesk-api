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

DependencyInjection.registerAll();
//* ====== Middleware Resolving ====== *//

//* ====== Controller Resolving ====== *//
export const authController = 
            container.resolve<IAuthController>(AuthController);

export const usersController =
            container.resolve<IUsersController>(UsersController);

export const vendorController =
            container.resolve<IVendorController>(VendorController);    
            
export const buildingController = 
            container.resolve<IBuildingController>(BuildingController);            

//* ====== Socket Handler Resolving ====== *//            
