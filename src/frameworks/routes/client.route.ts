import { Request, Response } from "express";
import { BaseRoute } from "./base.route";
import { authController, usersController } from "../di/resolver";
import { CustomRequest, decodeToken, verifyAuth } from "../../interfaceAdapters/middlewares/auth.middleware";

export class ClientRoutes extends BaseRoute{
    constructor(){
        super();
    }

    protected initializeRoutes(): void {
        this.router.post('/client/logout',verifyAuth,(req: Request, res: Response) => {
            authController.logout(req, res);
         })

          this.router.post("/client/refresh-token",decodeToken,(req: Request, res: Response) => {
            authController.handleTokenRefresh(req, res);
         });

        this.router.put("/client/update-profile",verifyAuth, (req: Request, res: Response) => {
            usersController.updateUserProfile(req, res);
        });

        this.router.put("/client/update-password", verifyAuth, (req: Request, res: Response) => {
            usersController.updateUserPassword(req, res);
        });
    }
}