import { NextFunction, Request, RequestHandler, Response } from "express";
import { BaseRoute } from "./base.route";
import { blockStatusMiddleware, authController, buildingController, usersController, bookingController, walletController, notifiactionController, chatController, amenityController } from "../di/resolver";
import { authorizeRole, decodeToken, verifyAuth } from "../../interfaceAdapters/middlewares/auth.middleware";

export class ClientRoutes extends BaseRoute{
    constructor(){
        super();
    }

    protected initializeRoutes(): void {

        this.router.post('/logout',verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            authController.logout(req, res, next);
         })

          this.router.post("/refresh-token",decodeToken,(req: Request, res: Response) => {
            authController.handleTokenRefresh(req, res);
         });

         this.router.get("/get-user-data", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            usersController.getUserData(req, res, next);
        });

        this.router.patch("/update-profile",verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            usersController.updateUserProfile(req, res, next);
        });

        this.router.patch("/update-password", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            usersController.updateUserPassword(req, res, next);
        });

         this.router.get("/list-buildings", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            buildingController.fetchBuildings(req, res, next);
        });

         this.router.get("/building/:id", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            buildingController.getSingleBuilding(req, res, next);
        });

        this.router.get("/get-booking-page-data/:spaceId", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            bookingController.getBookingPageData(req, res, next);
        });

        this.router.post("/create-payment-intent", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            bookingController.createPaymentIntent(req, res, next);
        });

        this.router.post("/confirm-payment", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            bookingController.confirmPayment(req, res, next);
        });

        this.router.get("/get-bookings", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            bookingController.getBookings(req, res, next);
        });
         this.router.get("/get-booking-details/:bookingId", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            bookingController.getBookingDetails(req, res, next);
        });

        this.router.patch("/cancel-booking", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            bookingController.cancelBooking(req, res, next);
        });
        this.router.get("/get-wallet-details", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            walletController.getWalletDetails(req, res, next);
        });
        this.router.post("/pay-with-wallet", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            walletController.payWithWallet(req, res, next);
        });
        this.router.post("/create-topup-payment-intent", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            walletController.createTopupIntent(req, res, next);
        });
         this.router.post("/confirm-topup-payment", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            walletController.confirmTopupPayment(req, res, next);
        });
         this.router.get("/get-notifications", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            notifiactionController.getNotifications(req, res, next);
        });
        this.router.patch("/mark-as-read/:id", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            notifiactionController.markAsRead(req, res, next);
        });
        this.router.patch("/mark-as-read", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            notifiactionController.markAsRead(req, res, next);
        });
        this.router.post("/create-session", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            chatController.createSession(req, res, next);
        });
        this.router.get("/getChats", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            chatController.getChats(req, res, next);
        });
        this.router.get("/messages", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            chatController.getMessages(req, res, next);
        });
        this.router.patch("/clear-chat", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            chatController.clearChat(req, res, next);
        });
        this.router.get("/fetch-filters", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            buildingController.fetchFilters(req, res, next);
        });
        this.router.delete("/clear-notifications", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            notifiactionController.clearNotification(req, res, next);
        });
        this.router.get("/get-amenities", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            amenityController.getAllAmenity(req, res, next);
        });
    }
}