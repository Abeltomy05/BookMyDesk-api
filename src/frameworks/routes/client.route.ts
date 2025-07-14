import { Request, RequestHandler, Response } from "express";
import { BaseRoute } from "./base.route";
import { blockStatusMiddleware, authController, buildingController, usersController, bookingController, walletController, notifiactionController, chatController } from "../di/resolver";
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

        this.router.post("/client/create-payment-intent", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            bookingController.createPaymentIntent(req, res);
        });

        this.router.post("/client/confirm-payment", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            bookingController.confirmPayment(req, res);
        });

        this.router.get("/client/get-bookings", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            bookingController.getBookings(req, res);
        });
         this.router.get("/client/get-booking-details/:bookingId", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            bookingController.getBookingDetails(req, res);
        });

        this.router.post("/client/cancel-booking", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            bookingController.cancelBooking(req, res);
        });
        this.router.get("/client/get-wallet-details", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            walletController.getWalletDetails(req, res);
        });
        this.router.post("/client/pay-with-wallet", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            walletController.payWithWallet(req, res);
        });
        this.router.post("/client/create-topup-payment-intent", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            walletController.createTopupIntent(req, res);
        });
         this.router.post("/client/confirm-topup-payment", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            walletController.confirmTopupPayment(req, res);
        });
         this.router.get("/client/get-notifications", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            notifiactionController.getNotifications(req, res);
        });
        this.router.patch("/client/mark-as-read/:id", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            notifiactionController.markAsRead(req, res);
        });
        this.router.post("/client/create-session", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            chatController.createSession(req, res);
        });
        this.router.get("/client/getChats", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            chatController.getChats(req, res);
        });
        this.router.get("/client/messages", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            chatController.getMessages(req, res);
        });
    }
}