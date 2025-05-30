import { container } from "tsyringe";
import { DependencyInjection } from "./index";
import { AuthController } from "../../interfaceAdapters/controllers/auth/auth.controller";
import { IAuthController } from "../../entities/controllerInterfaces/users/auth-controller.interface";
import { IUsersController } from "../../entities/controllerInterfaces/users/users-controller.interface";
import { UsersController } from "../../interfaceAdapters/controllers/users.controller";
import { IVendorController } from "../../entities/controllerInterfaces/users/vendor-controller.interface";
import { VendorController } from "../../interfaceAdapters/controllers/vendor.controller";

DependencyInjection.registerAll();
//* ====== Middleware Resolving ====== *//

//* ====== Controller Resolving ====== *//
export const authController = 
            container.resolve<IAuthController>(AuthController);

export const usersController =
            container.resolve<IUsersController>(UsersController);

export const vendorController =
            container.resolve(VendorController);           

//* ====== Socket Handler Resolving ====== *//            
