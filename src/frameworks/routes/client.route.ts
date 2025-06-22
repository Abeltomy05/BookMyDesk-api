import { Request, RequestHandler, Response } from "express";
import { BaseRoute } from "./base.route";
import { blockStatusMiddleware, authController, buildingController, usersController, bookingController } from "../di/resolver";
import { authorizeRole, decodeToken, verifyAuth } from "../../interfaceAdapters/middlewares/auth.middleware";

export class ClientRoutes extends BaseRoute{
    constructor(){
        super();
    }

    protected initializeRoutes(): void {

        this.router.post('/client/logout',verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            authController.logout(req, res);
         })

          this.router.post("/client/refresh-token",decodeToken,(req: Request, res: Response) => {
            authController.handleTokenRefresh(req, res);
         });

         this.router.get("/client/get-user-data", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            usersController.getUserData(req, res);
        });

        this.router.put("/client/update-profile",verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            usersController.updateUserProfile(req, res);
        });

        this.router.put("/client/update-password", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            usersController.updateUserPassword(req, res);
        });

         this.router.get("/client/list-buildings", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            buildingController.fetchBuildings(req, res);
        });

         this.router.get("/client/building/:id", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            buildingController.getSingleBuilding(req, res);
        });

        this.router.get("/client/get-booking-page-data/:spaceId", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            bookingController.getBookingPageData(req, res);
        });
    }
}