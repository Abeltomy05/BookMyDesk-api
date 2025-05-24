import { container } from "tsyringe";
import { DependencyInjection } from "./index";
import { AuthController } from "../../interfaceAdapters/controllers/auth/auth.controller";
import { IAuthController } from "../../entities/controllerInterfaces/users/auth-controller.interface";
import { IUsersController } from "../../entities/controllerInterfaces/users/users-controller.interface";
import { UsersController } from "../../interfaceAdapters/controllers/users.controller";

DependencyInjection.registerAll();
//* ====== Middleware Resolving ====== *//

//* ====== Controller Resolving ====== *//
export const authController = 
            container.resolve<IAuthController>(AuthController);

export const usersController =
            container.resolve<IUsersController>(UsersController);

//* ====== Socket Handler Resolving ====== *//            
