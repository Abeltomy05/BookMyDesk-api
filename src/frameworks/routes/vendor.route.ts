import { Request, Response } from "express";
import { BaseRoute } from "./base.route";
import { authController } from "../di/resolver";
import { CustomRequest, verifyAuth } from "../../interfaceAdapters/middlewares/auth.middleware";

export class VendorRoutes extends BaseRoute{
    constructor(){
        super();
    }

    protected initializeRoutes(): void {
        this.router.post('/vendor/logout',verifyAuth,(req: Request, res: Response) => {
            authController.logout(req, res);
         })
    }
}