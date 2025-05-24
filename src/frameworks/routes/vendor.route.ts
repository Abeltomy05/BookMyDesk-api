import { Request, Response } from "express";
import { BaseRoute } from "./base.route";
import { authController } from "../di/resolver";
import { CustomRequest, decodeToken, verifyAuth } from "../../interfaceAdapters/middlewares/auth.middleware";

export class VendorRoutes extends BaseRoute{
    constructor(){
        super();
    }

    protected initializeRoutes(): void {
        this.router.post('/vendor/logout',verifyAuth,(req: Request, res: Response) => {
            authController.logout(req, res);
         })

        this.router.post("/vendor/refresh-token",decodeToken,(req: Request, res: Response) => {
                    authController.handleTokenRefresh(req, res);
      }); 
    }
}