import { NextFunction, Request, RequestHandler, Response } from "express";
import { BaseRoute } from "./base.route";
import { blockStatusMiddleware, authController,buildingController,usersController,vendorController, bookingController, walletController, offerController, notifiactionController, chatController, amenityController } from "../di/resolver";
import { authorizeRole, decodeToken, verifyAuth } from "../../interfaceAdapters/middlewares/auth.middleware";

export class VendorRoutes extends BaseRoute{
    constructor(){
        super();
    }

    protected initializeRoutes(): void {
        this.router.post('/logout',verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
             authController.logout(req, res, next);
         })

        this.router.post("/refresh-token",(req: Request, res: Response) => {
             authController.handleTokenRefresh(req, res);
      }); 

      this.router.post("/upload-id-proof",verifyAuth, authorizeRole(["vendor"]), (req: Request, res: Response, next: NextFunction) => {
             vendorController.uploadIdProof(req, res, next);
        });

      this.router.get("/get-user-data", verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
        usersController.getUserData(req, res, next);
      });   
     
     this.router.patch("/update-profile",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
                  usersController.updateUserProfile(req, res, next);
     });  

     this.router.patch("/update-password", verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            usersController.updateUserPassword(req, res, next);
        });

    this.router.get("/get-retry-data", (req: Request, res: Response, next: NextFunction) => {
            vendorController.getRetryData(req, res, next);
        }); 
      this.router.post("/retry-registration", (req: Request, res: Response, next: NextFunction) => {
            vendorController.retryRegistration(req, res, next);
        }); 
    
    this.router.get("/building/:id",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            buildingController.getSingleBuilding(req, res, next);
        }); 

    this.router.get("/get-all-buildings",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            buildingController.getAllBuilding(req, res, next);
        });  
     this.router.post("/register-building",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            buildingController.registerBuilding(req, res, next);
        });      
      this.router.put("/edit-building",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            buildingController.editBuilding(req, res, next);
        });     
       this.router.patch("/update-status",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
            usersController.updateEntityStatus(req, res, next);
        });  
     
        this.router.get("/get-bookings",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         bookingController.getBookings(req, res, next);
       });  
       this.router.patch("/cancel-booking",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         bookingController.cancelBooking(req, res, next);
       });   

       this.router.get("/get-wallet-details",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         walletController.getWalletDetails(req, res, next);
       });  

       this.router.get("/get-vendor-home-data",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         vendorController.vendorHomeData(req, res, next);
       });  
       this.router.get("/completed-bookings",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         vendorController.vendorHomeData(req, res, next);
       });  
       this.router.get("/buildings-for-vendor",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         vendorController.fetchBuildingsForVendor(req, res, next);
       });  
       this.router.get("/spaces-for-buildings/:buildingId",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         vendorController.fetchSpaceForBuilding(req, res, next);
       }); 
        this.router.get("/get-offers",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         offerController.fetchAllOffers(req, res, next);
       }); 
        this.router.post("/create-offer",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         offerController.createOffer(req, res, next);
       }); 
         this.router.delete("/delete-offer",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         usersController.deleteEntity(req, res, next);
       }); 
          this.router.get("/get-notifications",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         notifiactionController.getNotifications(req, res, next);
       }); 
          this.router.patch("/mark-as-read/:id",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         notifiactionController.markAsRead(req, res, next);
       }); 
          this.router.patch("/mark-as-read",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         notifiactionController.markAsRead(req, res, next);
       });
         this.router.get("/getChats",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         chatController.getChats(req, res, next);
       }); 
        this.router.get("/messages",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         chatController.getMessages(req, res, next);
       }); 
        this.router.patch("/clear-chat",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         chatController.clearChat(req, res, next);
       }); 
        this.router.get("/revenue-report",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         bookingController.bookingsForRevenueReport(req, res, next);
       });
       this.router.get("/revenue-chart",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         bookingController.getRevenueChartData(req, res, next);
       });
       this.router.delete("/clear-notifications",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         notifiactionController.clearNotification(req, res, next);
       });
       this.router.get("/get-amenities",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         amenityController.getAllAmenity(req, res, next);
       });
       this.router.get("/retry-building",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         buildingController.reapplyBuildingData(req, res, next);
       });
       this.router.post("/retry-building",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         buildingController.retryBuildingRegistration(req, res, next);
       });
       this.router.post("/request-amenity",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         amenityController.requestAmenity(req, res, next);
       });
    }
}