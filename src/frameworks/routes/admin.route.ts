import { NextFunction, Request, Response } from "express";
import { amenityController, authController, bookingController, buildingController, notifiactionController, usersController, vendorController, walletController } from "../di/resolver";
import { BaseRoute } from "./base.route";
import { authorizeRole, verifyAuth } from "../../interfaceAdapters/middlewares/auth.middleware";

export class AdminRoutes extends BaseRoute{
    constructor(){
        super();
    }

    protected initializeRoutes(): void {
          this.router.post('/logout',verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            authController.logout(req, res, next);
         })

         this.router.post("/refresh-token",(req: Request, res: Response) => {
            authController.handleTokenRefresh(req, res);
        });

        this.router.get("/getAllUsers",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            usersController.getAllUsers(req, res, next);
        });

         this.router.patch("/update-status",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            usersController.updateEntityStatus(req, res, next);
        });
        this.router.get("/get-user-count",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            usersController.getUserCount(req, res, next);
        });

         this.router.get("/get-pending-buildings",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            buildingController.getBuildingsForVerification(req, res, next);
        });

          this.router.get("/get-wallet-details",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            walletController.getWalletDetails(req, res, next);
        });
         this.router.get("/get-bookings",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            bookingController.getBookingsForAdmin(req, res, next);
        });
        this.router.get("/get-vendor-buildings",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            usersController.getVendorsAndBuildings(req, res, next);
        });
        this.router.get("/get-single-vendor/:vendorId",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            vendorController.singleVendorData(req, res, next);
        });
        this.router.get("/get-notifications",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            notifiactionController.getNotifications(req, res, next);
        });
        this.router.patch("/mark-as-read/:id",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            notifiactionController.markAsRead(req, res, next);
        });
         this.router.patch("/mark-as-read",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            notifiactionController.markAsRead(req, res, next);
        });
        this.router.get("/monthly-stats",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            usersController.getMonthlyBookingStats(req, res, next);
        });
        this.router.get("/get-every-building",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            buildingController.getEveryBuilding(req, res, next);
        });
        this.router.get("/revenue-chart",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            bookingController.getRevenueChartData(req, res, next);
        });
        this.router.get("/revenue-report",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            bookingController.adminRevenueReport(req, res, next);
        });
        this.router.delete("/clear-notifications",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            notifiactionController.clearNotification(req, res, next);
        });
        this.router.get("/get-amenities",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            amenityController.getAllAmenity(req, res, next);
        });
        this.router.post("/create-amenity",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            amenityController.createAmenity(req, res, next);
        });
        this.router.patch("/edit-amenity",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            amenityController.editAmenity(req, res, next);
        });
        this.router.delete("/delete-amenity",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            amenityController.deleteAmenity(req, res, next);
        });
    }
}