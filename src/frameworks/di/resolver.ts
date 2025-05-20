import { container } from "tsyringe";
import { DependencyInjection } from "./index";
import { AuthController } from "../../interfaceAdapters/controllers/auth/auth.controller";
import { IAuthController } from "../../entities/controllerInterfaces/users/auth-controller.interface";

DependencyInjection.registerAll();
//* ====== Middleware Resolving ====== *//

//* ====== Controller Resolving ====== *//
export const authController = 
            container.resolve<IAuthController>(AuthController);



//* ====== Socket Handler Resolving ====== *//            
