import { NextFunction, Request, RequestHandler, Response } from "express";
import { BaseRoute } from "./base.route";
import { blockStatusMiddleware, authController, buildingController, usersController, bookingController, walletController, notifiactionController, chatController, amenityController } from "../di/resolver";
import { authorizeRole, decodeToken, verifyAuth } from "../../interfaceAdapters/middlewares/auth.middleware";

export class ClientRoutes extends BaseRoute{
    constructor(){
        super();
    }

    protected initializeRoutes(): void {

        this.router.post('/client/logout',verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            authController.logout(req, res, next);
         })

          this.router.post("/client/refresh-token",decodeToken,(req: Request, res: Response) => {
            authController.handleTokenRefresh(req, res);
         });

         this.router.get("/client/get-user-data", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            usersController.getUserData(req, res, next);
        });

        this.router.patch("/client/update-profile",verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            usersController.updateUserProfile(req, res, next);
        });

        this.router.patch("/client/update-password", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            usersController.updateUserPassword(req, res, next);
        });

         this.router.get("/client/list-buildings", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            buildingController.fetchBuildings(req, res, next);
        });

         this.router.get("/client/building/:id", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            buildingController.getSingleBuilding(req, res, next);
        });

        this.router.get("/client/get-booking-page-data/:spaceId", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            bookingController.getBookingPageData(req, res, next);
        });

        this.router.post("/client/create-payment-intent", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            bookingController.createPaymentIntent(req, res, next);
        });

        this.router.post("/client/confirm-payment", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            bookingController.confirmPayment(req, res, next);
        });

        this.router.get("/client/get-bookings", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            bookingController.getBookings(req, res, next);
        });
         this.router.get("/client/get-booking-details/:bookingId", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            bookingController.getBookingDetails(req, res, next);
        });

        this.router.patch("/client/cancel-booking", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            bookingController.cancelBooking(req, res, next);
        });
        this.router.get("/client/get-wallet-details", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            walletController.getWalletDetails(req, res, next);
        });
        this.router.post("/client/pay-with-wallet", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            walletController.payWithWallet(req, res, next);
        });
        this.router.post("/client/create-topup-payment-intent", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            walletController.createTopupIntent(req, res, next);
        });
         this.router.post("/client/confirm-topup-payment", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            walletController.confirmTopupPayment(req, res, next);
        });
         this.router.get("/client/get-notifications", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            notifiactionController.getNotifications(req, res, next);
        });
        this.router.patch("/client/mark-as-read/:id", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            notifiactionController.markAsRead(req, res, next);
        });
        this.router.patch("/client/mark-as-read", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            notifiactionController.markAsRead(req, res, next);
        });
        this.router.post("/client/create-session", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            chatController.createSession(req, res, next);
        });
        this.router.get("/client/getChats", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            chatController.getChats(req, res, next);
        });
        this.router.get("/client/messages", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            chatController.getMessages(req, res, next);
        });
        this.router.patch("/client/clear-chat", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            chatController.clearChat(req, res, next);
        });
        this.router.get("/client/fetch-filters", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            buildingController.fetchFilters(req, res, next);
        });
        this.router.delete("/client/clear-notifications", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            notifiactionController.clearNotification(req, res, next);
        });
        this.router.get("/client/get-amenities", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            amenityController.getAllAmenity(req, res, next);
        });
    }
}