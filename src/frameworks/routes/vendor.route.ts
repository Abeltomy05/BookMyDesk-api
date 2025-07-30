import { NextFunction, Request, RequestHandler, Response } from "express";
import { BaseRoute } from "./base.route";
import { blockStatusMiddleware, authController,buildingController,usersController,vendorController, bookingController, walletController, offerController, notifiactionController, chatController } from "../di/resolver";
import { authorizeRole, decodeToken, verifyAuth } from "../../interfaceAdapters/middlewares/auth.middleware";

export class VendorRoutes extends BaseRoute{
    constructor(){
        super();
    }

    protected initializeRoutes(): void {
        this.router.post('/vendor/logout',verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
             authController.logout(req, res, next);
         })

        this.router.post("/vendor/refresh-token",decodeToken,(req: Request, res: Response) => {
             authController.handleTokenRefresh(req, res);
      }); 

      this.router.post("/vendor/upload-id-proof",verifyAuth, authorizeRole(["vendor"]), (req: Request, res: Response, next: NextFunction) => {
             vendorController.uploadIdProof(req, res, next);
        });

      this.router.get("/vendor/get-user-data", verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
        usersController.getUserData(req, res, next);
      });   
     
     this.router.put("/vendor/update-profile",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
                  usersController.updateUserProfile(req, res, next);
     });  

     this.router.put("/vendor/update-password", verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            usersController.updateUserPassword(req, res, next);
        });

    this.router.get("/vendor/get-retry-data", (req: Request, res: Response, next: NextFunction) => {
            vendorController.getRetryData(req, res, next);
        }); 
      this.router.post("/vendor/retry-registration", (req: Request, res: Response, next: NextFunction) => {
            vendorController.retryRegistration(req, res, next);
        }); 
    
    this.router.get("/vendor/building/:id",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            buildingController.getSingleBuilding(req, res, next);
        }); 

    this.router.get("/vendor/get-all-buildings",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            buildingController.getAllBuilding(req, res, next);
        });  
     this.router.post("/vendor/register-building",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            buildingController.registerBuilding(req, res, next);
        });      
      this.router.put("/vendor/edit-building",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response, next: NextFunction) => {
            buildingController.editBuilding(req, res, next);
        });     
       this.router.patch("/vendor/update-status",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
            usersController.updateEntityStatus(req, res, next);
        });  
     
        this.router.get("/vendor/get-bookings",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         bookingController.getBookings(req, res, next);
       });  
       this.router.post("/vendor/cancel-booking",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         bookingController.cancelBooking(req, res, next);
       });   

       this.router.get("/vendor/get-wallet-details",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         walletController.getWalletDetails(req, res, next);
       });  

       this.router.get("/vendor/get-vendor-home-data",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         vendorController.vendorHomeData(req, res, next);
       });  
       this.router.get("/vendor/completed-bookings",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         vendorController.vendorHomeData(req, res, next);
       });  
       this.router.get("/vendor/buildings-for-vendor",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         vendorController.fetchBuildingsForVendor(req, res, next);
       });  
       this.router.get("/vendor/spaces-for-buildings/:buildingId",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         vendorController.fetchSpaceForBuilding(req, res, next);
       }); 
        this.router.get("/vendor/get-offers",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         offerController.fetchAllOffers(req, res, next);
       }); 
        this.router.post("/vendor/create-offer",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         offerController.createOffer(req, res, next);
       }); 
         this.router.delete("/vendor/delete-offer",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         usersController.deleteEntity(req, res, next);
       }); 
          this.router.get("/vendor/get-notifications",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         notifiactionController.getNotifications(req, res, next);
       }); 
          this.router.patch("/vendor/mark-as-read/:id",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         notifiactionController.markAsRead(req, res, next);
       }); 
         this.router.get("/vendor/getChats",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         chatController.getChats(req, res, next);
       }); 
        this.router.get("/vendor/messages",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         chatController.getMessages(req, res, next);
       }); 
        this.router.post("/vendor/clear-chat",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         chatController.clearChat(req, res, next);
       }); 
        this.router.get("/vendor/revenue-report",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         bookingController.bookingsForRevenueReport(req, res, next);
       });
       this.router.get("/vendor/revenue-chart",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) => {
         bookingController.getRevenueChartData(req, res, next);
       });
    }
}