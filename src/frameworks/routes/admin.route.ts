import { Request, Response } from "express";
import { authController, bookingController, buildingController, notifiactionController, usersController, vendorController, walletController } from "../di/resolver";
import { BaseRoute } from "./base.route";
import { authorizeRole, verifyAuth } from "../../interfaceAdapters/middlewares/auth.middleware";

export class AdminRoutes extends BaseRoute{
    constructor(){
        super();
    }

    protected initializeRoutes(): void {
          this.router.post('/admin/logout',verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response) => {
            authController.logout(req, res);
         })

         this.router.post("/admin/refresh-token",(req: Request, res: Response) => {
            authController.handleTokenRefresh(req, res);
        });

        this.router.get("/admin/getAllUsers",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response) => {
            usersController.getAllUsers(req, res);
        });

         this.router.patch("/admin/update-status",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response) => {
            usersController.updateEntityStatus(req, res);
        });
        this.router.get("/admin/get-user-count",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response) => {
            usersController.getUserCount(req, res);
        });

         this.router.get("/admin/get-pending-buildings",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response) => {
            buildingController.getBuildingsForVerification(req, res);
        });

          this.router.get("/admin/get-wallet-details",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response) => {
            walletController.getWalletDetails(req, res);
        });
         this.router.get("/admin/get-bookings",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response) => {
            bookingController.getBookingsForAdmin(req, res);
        });
        this.router.get("/admin/get-vendor-buildings",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response) => {
            usersController.getVendorsAndBuildings(req, res);
        });
        this.router.get("/admin/get-single-vendor/:vendorId",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response) => {
            vendorController.singleVendorData(req, res);
        });
        this.router.get("/admin/get-notifications",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response) => {
            notifiactionController.getNotifications(req, res);
        });
        this.router.patch("/admin/mark-as-read/:id",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response) => {
            notifiactionController.markAsRead(req, res);
        });
        this.router.get("/admin/monthly-stats",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response) => {
            usersController.getMonthlyBookingStats(req, res);
        });
        this.router.get("/admin/get-every-building",verifyAuth, authorizeRole(["admin"]), (req: Request, res: Response) => {
            buildingController.getEveryBuilding(req, res);
        });
    }
}