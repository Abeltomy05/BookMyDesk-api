import { NextFunction, Request, RequestHandler, Response } from "express";
import { BaseRoute } from "./base.route";
import { blockStatusMiddleware, authController,buildingController,usersController,vendorController, bookingController, walletController, offerController, notifiactionController, chatController, amenityController } from "../di/resolver";
import { authorizeRole, verifyAuth } from "../../interfaceAdapters/middlewares/auth.middleware";

export class VendorRoutes extends BaseRoute{
    constructor(){
        super();
    }

    protected initializeRoutes(): void {

       //* ====== Auth & Session ====== *//

    this.router.post('/logout',verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
        authController.logout(req, res, next);
    })
    this.router.post("/refresh-token",(req: Request, res: Response) => {
          authController.handleTokenRefresh(req, res);
    }); 

       //* ====== Vendor ====== *//

    this.router.post("/users/id-proof",verifyAuth, authorizeRole(["vendor"]), (req: Request, res: Response, next: NextFunction) => {
       vendorController.uploadIdProof(req, res, next);
    });


    this.router.route("/users/me")
        .get(verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
          usersController.getUserData(req, res, next);
         })   
        .patch(verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
          usersController.updateUserProfile(req, res, next);
         });  


    this.router.patch("/users/password", verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
        usersController.updateUserPassword(req, res, next);
    });


    this.router.route("/users/retry")
        .get((req: Request, res: Response, next: NextFunction) => {
            vendorController.getRetryData(req, res, next);
         })
        .post((req: Request, res: Response, next: NextFunction) => {
            vendorController.retryRegistration(req, res, next);
         });


    this.router.get("/users/home-data",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
      vendorController.vendorHomeData(req, res, next);
    });   

     //* ====== Buildings ====== *//

    this.router.route("/buildings")
        .get(verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            buildingController.getAllBuilding(req, res, next);
         })  
        .post(verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            buildingController.registerBuilding(req, res, next);
         });  
         
         
    this.router.put("/buildings/edit",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
        buildingController.editBuilding(req, res, next);
    });     
    this.router.patch("/entity/status",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
        usersController.updateEntityStatus(req, res, next);
    });  
    this.router.get("/buildings/vendor",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
        vendorController.fetchBuildingsForVendor(req, res, next);
    }); 
    this.router.get("/buildings/:id",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
        buildingController.getSingleBuilding(req, res, next);
    }); 
    this.router.get("/buildings/:id/spaces",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
      vendorController.fetchSpaceForBuilding(req, res, next);
    });


    this.router.route("/buildings/retry")
        .get(verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
          buildingController.reapplyBuildingData(req, res, next);
         })
        .post(verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
          buildingController.retryBuildingRegistration(req, res, next);
        });


     //* ====== Bookings ====== *//
     
    this.router.get("/bookings",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
      bookingController.getBookings(req, res, next);
    });  
    this.router.patch("/bookings/:bookingId/cancel",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
      bookingController.cancelBooking(req, res, next);
    }); 
    this.router.get("/bookings/completed ",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
      vendorController.vendorHomeData(req, res, next);
    }); 
    this.router.get("/bookings/revenue-report",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
      bookingController.bookingsForRevenueReport(req, res, next);
    });
    this.router.get("/bookings/revenue-chart",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
      bookingController.getRevenueChartData(req, res, next);
    });
    
    //* ====== Wallet ====== *//
    
    this.router.get("/wallet",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
      walletController.getWalletDetails(req, res, next);
    });

    //* ====== Offers ====== *//
    
    this.router.route("/offers")
        .get(verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
          offerController.fetchAllOffers(req, res, next);
         }) 
        .post(verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
          offerController.createOffer(req, res, next);
        })
        .delete(verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
          usersController.deleteEntity(req, res, next);
        }); 


    //* ====== Notifications ====== *//

    this.router.route("/notifications")
        .get(verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
          notifiactionController.getNotifications(req, res, next);
         })  
        .patch(verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
          notifiactionController.markAsRead(req, res, next);
         })
        .delete(verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
          notifiactionController.clearNotification(req, res, next);
         });

    this.router.patch("/notifications/:id/read",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
      notifiactionController.markAsRead(req, res, next);
    });


    //* ====== Chat ====== *//

    this.router.get("/chats",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
      chatController.getChats(req, res, next);
    }); 
    this.router.get("/chats/:chatId/messages",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
      chatController.getMessages(req, res, next);
    }); 
    this.router.patch("/chats/:chatId/clear",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
      chatController.clearChat(req, res, next);
    }); 


    //* ====== Amenity ====== *//

    this.router.route("/amenities")
        .get(verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
          amenityController.getAllAmenity(req, res, next);
         })
        .post(verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
          amenityController.requestAmenity(req, res, next);
         })
    }
}

