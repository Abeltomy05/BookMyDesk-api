import { Request, RequestHandler, Response } from "express";
import { BaseRoute } from "./base.route";
import { blockStatusMiddleware, authController,buildingController,usersController,vendorController, bookingController, walletController } from "../di/resolver";
import { authorizeRole, decodeToken, verifyAuth } from "../../interfaceAdapters/middlewares/auth.middleware";

export class VendorRoutes extends BaseRoute{
    constructor(){
        super();
    }

    protected initializeRoutes(): void {
        this.router.post('/vendor/logout',verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response) => {
             authController.logout(req, res);
         })

        this.router.post("/vendor/refresh-token",decodeToken,(req: Request, res: Response) => {
             authController.handleTokenRefresh(req, res);
      }); 

      this.router.post("/vendor/upload-id-proof",verifyAuth, authorizeRole(["vendor"]), (req: Request, res: Response) => {
             vendorController.uploadIdProof(req, res);
        });

      this.router.get("/vendor/get-user-data", verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
        usersController.getUserData(req, res);
      });   
     
     this.router.put("/vendor/update-profile",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
                  usersController.updateUserProfile(req, res);
     });  

     this.router.put("/vendor/update-password", verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            usersController.updateUserPassword(req, res);
        });

    this.router.get("/vendor/get-retry-data", (req: Request, res: Response) => {
            vendorController.getRetryData(req, res);
        }); 
      this.router.post("/vendor/retry-registration", (req: Request, res: Response) => {
            vendorController.retryRegistration(req, res);
        }); 
    
    this.router.get("/vendor/building/:id",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            buildingController.getSingleBuilding(req, res);
        }); 

    this.router.get("/vendor/get-all-buildings",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            buildingController.getAllBuilding(req, res);
        });  
     this.router.post("/vendor/register-building",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            buildingController.registerBuilding(req, res);
        });      
      this.router.put("/vendor/edit-building",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler, (req: Request, res: Response) => {
            buildingController.editBuilding(req, res);
        });     
       this.router.patch("/vendor/update-status",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response) => {
            usersController.updateEntityStatus(req, res);
        });  
     
        this.router.get("/vendor/get-bookings",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response) => {
         bookingController.getBookings(req, res);
       });  
       this.router.post("/vendor/cancel-booking",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response) => {
         bookingController.cancelBooking(req, res);
       });   

       this.router.get("/vendor/get-wallet-details",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response) => {
         walletController.getWalletDetails(req, res);
       });  

       this.router.get("/vendor/get-vendor-home-data",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response) => {
         vendorController.vendorHomeData(req, res);
       });  

       this.router.get("/vendor/completed-bookings",verifyAuth, authorizeRole(["vendor"]), blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response) => {
         vendorController.vendorHomeData(req, res);
       });  
    }
}