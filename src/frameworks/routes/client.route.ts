import { NextFunction, Request, RequestHandler, Response } from "express";
import { BaseRoute } from "./base.route";
import { blockStatusMiddleware, authController, buildingController, usersController, bookingController, walletController, notifiactionController, chatController, amenityController } from "../di/resolver";
import { authorizeRole, verifyAuth } from "../../interfaceAdapters/middlewares/auth.middleware";

export class ClientRoutes extends BaseRoute{
    constructor(){
        super();
    }

    protected initializeRoutes(): void {

        //* ====== Authentication ====== *//

        this.router.post('/logout',verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            authController.logout(req, res, next);
         })

          this.router.post("/refresh-token",(req: Request, res: Response) => {
            authController.handleTokenRefresh(req, res);
         });

         //* ====== User Profile ====== *//

        this.router.route("/users/me")
             .get(verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
                usersController.getUserData(req, res, next);
              })
             .patch(verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
                usersController.updateUserProfile(req, res, next);
              });

        this.router.patch("/users/me/password", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            usersController.updateUserPassword(req, res, next);
        });

        //* ====== Buildings ====== *//

         this.router.get("/buildings", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            buildingController.fetchBuildings(req, res, next);
        });

        this.router.get("/buildings/filters", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            buildingController.fetchFilters(req, res, next);
        });

         this.router.get("/buildings/:id", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            buildingController.getSingleBuilding(req, res, next);
        });

        this.router.get("/amenities", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            amenityController.getAllAmenity(req, res, next);
        });

        //* ====== Bookings ====== *//

        this.router.get("/bookings/page-data/:spaceId", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            bookingController.getBookingPageData(req, res, next);
        });
        this.router.post("/bookings/payment-intent", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            bookingController.createPaymentIntent(req, res, next);
        });
        this.router.post("/bookings/confirm-payment", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            bookingController.confirmPayment(req, res, next);
        });
        this.router.get("/bookings", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            bookingController.getBookings(req, res, next);
        });
         this.router.get("/bookings/:bookingId", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            bookingController.getBookingDetails(req, res, next);
        });
        this.router.patch("/bookings/:bookingId/cancel", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            bookingController.cancelBooking(req, res, next);
        });

        //* ====== Wallet ====== *//

        this.router.get("/wallet", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            walletController.getWalletDetails(req, res, next);
        });
        this.router.post("/wallet/pay", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            walletController.payWithWallet(req, res, next);
        });
        this.router.post("/wallet/topup-intent", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            walletController.createTopupIntent(req, res, next);
        });
         this.router.post("/wallet/topup", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            walletController.confirmTopupPayment(req, res, next);
        });


         //* ====== Notifications ====== *//

        this.router.route("/notifications")
            .get(verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
                notifiactionController.getNotifications(req, res, next);
             })
            .patch(verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
                notifiactionController.markAsRead(req, res, next);
             })
            .delete(verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
                notifiactionController.clearNotification(req, res, next);
             });

        this.router.patch("/notifications/:id/read", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            notifiactionController.markAsRead(req, res, next);
        });


         //* ====== Chat ====== *//

        this.router.post("/chats/sessions", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            chatController.createSession(req, res, next);
        });
        this.router.get("/chats", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            chatController.getChats(req, res, next);
        });
        this.router.get("/chats/:chatId/messages", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            chatController.getMessages(req, res, next);
        });
        this.router.patch("/chats/:chatId/clear", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            chatController.clearChat(req, res, next);
        });

    }
}