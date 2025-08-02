import { NextFunction, Request, Response } from "express";
import { amenityController, authController, bookingController, buildingController, notifiactionController, usersController, vendorController, walletController } from "../di/resolver";
import { BaseRoute } from "./base.route";
import { authorizeRole, verifyAuth } from "../../interfaceAdapters/middlewares/auth.middleware";

export class AdminRoutes extends BaseRoute{
    constructor(){
        super();
    }

    protected initializeRoutes(): void {
          this.router.post('/admin/logout',verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            authController.logout(req, res, next);
         })

         this.router.post("/admin/refresh-token",(req: Request, res: Response) => {
            authController.handleTokenRefresh(req, res);
        });

        this.router.get("/admin/getAllUsers",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            usersController.getAllUsers(req, res, next);
        });

         this.router.patch("/admin/update-status",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            usersController.updateEntityStatus(req, res, next);
        });
        this.router.get("/admin/get-user-count",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            usersController.getUserCount(req, res, next);
        });

         this.router.get("/admin/get-pending-buildings",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            buildingController.getBuildingsForVerification(req, res, next);
        });

          this.router.get("/admin/get-wallet-details",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            walletController.getWalletDetails(req, res, next);
        });
         this.router.get("/admin/get-bookings",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            bookingController.getBookingsForAdmin(req, res, next);
        });
        this.router.get("/admin/get-vendor-buildings",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            usersController.getVendorsAndBuildings(req, res, next);
        });
        this.router.get("/admin/get-single-vendor/:vendorId",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            vendorController.singleVendorData(req, res, next);
        });
        this.router.get("/admin/get-notifications",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            notifiactionController.getNotifications(req, res, next);
        });
        this.router.patch("/admin/mark-as-read/:id",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            notifiactionController.markAsRead(req, res, next);
        });
        this.router.get("/admin/monthly-stats",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            usersController.getMonthlyBookingStats(req, res, next);
        });
        this.router.get("/admin/get-every-building",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            buildingController.getEveryBuilding(req, res, next);
        });
        this.router.get("/admin/revenue-chart",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            bookingController.getRevenueChartData(req, res, next);
        });
        this.router.get("/admin/revenue-report",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            bookingController.adminRevenueReport(req, res, next);
        });
        this.router.delete("/admin/clear-notifications",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            notifiactionController.clearNotification(req, res, next);
        });
        this.router.get("/admin/get-amenities",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            amenityController.getAllAmenity(req, res, next);
        });
        this.router.post("/admin/create-amenity",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            amenityController.createAmenity(req, res, next);
        });
        this.router.patch("/admin/edit-amenity",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            amenityController.editAmenity(req, res, next);
        });
        this.router.delete("/admin/delete-amenity",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            amenityController.deleteAmenity(req, res, next);
        });
    }
}