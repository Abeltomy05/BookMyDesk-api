import { NextFunction, Request, Response } from "express";
import { amenityController, authController, bookingController, buildingController, notifiactionController, usersController, vendorController, walletController } from "../di/resolver";
import { BaseRoute } from "./base.route";
import { authorizeRole, verifyAuth } from "../../interfaceAdapters/middlewares/auth.middleware";

export class AdminRoutes extends BaseRoute{
    constructor(){
        super();
    }

    protected initializeRoutes(): void {
        
        //*========================================================
        //*               🗡️ AUTH & SESSION 🗡️
        //*========================================================

        this.router.post('/logout',verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            authController.logout(req, res, next);
        })
        this.router.post("/refresh-token",(req: Request, res: Response) => {
            authController.handleTokenRefresh(req, res);
        });

        //*========================================================
        //*        🗡️ USERS,BUILDING,BOOKING MANAGEMENT 🗡️
        //*========================================================

        this.router.get("/users",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            usersController.getAllUsers(req, res, next);
        });
         this.router.patch("/status",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            usersController.updateEntityStatus(req, res, next);
        });
        this.router.get("/users/count",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            usersController.getUserCount(req, res, next);
        });
         this.router.get("/buildings/verification/pending",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            buildingController.getBuildingsForVerification(req, res, next);
        });
         this.router.get("/wallet",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            walletController.getWalletDetails(req, res, next);
        });
         this.router.get("/bookings",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            bookingController.getBookingsForAdmin(req, res, next);
        });
        this.router.get("/vendors/buildings",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            usersController.getVendorsAndBuildings(req, res, next);
        });
        this.router.get("/vendors/:vendorId",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            vendorController.singleVendorData(req, res, next);
        });
        this.router.get("/buildings",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            buildingController.getEveryBuilding(req, res, next);
        });


        //*========================================================
        //*               🗡️ REVENUE 🗡️
        //*========================================================

        this.router.get("/stats/monthly",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            usersController.getMonthlyBookingStats(req, res, next);
        });
        this.router.get("/reports/revenue-chart",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            bookingController.getRevenueChartData(req, res, next);
        });
        this.router.get("/reports/revenue",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            bookingController.adminRevenueReport(req, res, next);
        });


        //*========================================================
        //*               🗡️ NOTIFICATION 🗡️
        //*========================================================

        this.router.route("/notifications")
            .get(verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
                notifiactionController.getNotifications(req, res, next);
             })
            .patch(verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
                notifiactionController.markAsRead(req, res, next);
             }) 
            .delete(verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
                notifiactionController.clearNotification(req, res, next);
             }) 

        this.router.patch("/notifications/:id/read",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            notifiactionController.markAsRead(req, res, next);
        });


        //*========================================================
        //*               🗡️ AMENITIES MANAGEMENT 🗡️
        //*========================================================

        this.router.route("/amenities")
            .get(verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
                amenityController.getAllAmenity(req, res, next);
             })
            .post(verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
                amenityController.createAmenity(req, res, next);
             })


        this.router.route("/amenities/:id")
            .patch(verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
                amenityController.editAmenity(req, res, next);
             })
            .delete(verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
                amenityController.deleteAmenity(req, res, next);
             });


        this.router.get("/amenities/pending",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            amenityController.getPendingAmenities(req, res, next);
        });
    }
}