import { Request, Response } from "express";
import { authController, usersController } from "../di/resolver";
import { BaseRoute } from "./base.route";
import { decodeToken, verifyAuth } from "../../interfaceAdapters/middlewares/auth.middleware";

export class AdminRoutes extends BaseRoute{
    constructor(){
        super();
    }

    protected initializeRoutes(): void {
          this.router.post('/admin/logout',verifyAuth,(req: Request, res: Response) => {
            authController.logout(req, res);
         })

         this.router.post("/admin/refresh-token",decodeToken,(req: Request, res: Response) => {
            authController.handleTokenRefresh(req, res);
        });

        this.router.get("/admin/getAllUsers",verifyAuth,(req: Request, res: Response) => {
            usersController.getAllUsers(req, res);
        });

         this.router.post("/admin/update-user-status",verifyAuth,(req: Request, res: Response) => {
            usersController.updateUserStatus(req, res);
        });
    }
}