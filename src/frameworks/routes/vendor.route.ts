import { Request, Response } from "express";
import { BaseRoute } from "./base.route";
import { authController,buildingController,usersController,vendorController } from "../di/resolver";
import { CustomRequest, decodeToken, verifyAuth } from "../../interfaceAdapters/middlewares/auth.middleware";

export class VendorRoutes extends BaseRoute{
    constructor(){
        super();
    }

    protected initializeRoutes(): void {
        this.router.post('/vendor/logout',verifyAuth,(req: Request, res: Response) => {
             authController.logout(req, res);
         })

        this.router.post("/vendor/refresh-token",decodeToken,(req: Request, res: Response) => {
             authController.handleTokenRefresh(req, res);
      }); 

      this.router.post("/vendor/upload-id-proof",verifyAuth, (req: Request, res: Response) => {
             vendorController.uploadIdProof(req, res);
        });

      this.router.get("/vendor/get-user-data", verifyAuth, (req: Request, res: Response) => {
        usersController.getUserData(req, res);
      });   
     
     this.router.put("/vendor/update-profile",verifyAuth, (req: Request, res: Response) => {
                  usersController.updateUserProfile(req, res);
     });  

     this.router.put("/vendor/update-password", verifyAuth, (req: Request, res: Response) => {
            usersController.updateUserPassword(req, res);
        });

    this.router.get("/vendor/get-retry-data", (req: Request, res: Response) => {
            vendorController.getRetryData(req, res);
        }); 
      this.router.post("/vendor/retry-registration", (req: Request, res: Response) => {
            vendorController.retryRegistration(req, res);
        }); 
    
    this.router.get("/vendor/building/:id",verifyAuth, (req: Request, res: Response) => {
            buildingController.getSingleBuilding(req, res);
        }); 

    this.router.get("/vendor/get-all-buildings",verifyAuth, (req: Request, res: Response) => {
            buildingController.getAllBuilding(req, res);
        });  
     this.router.post("/vendor/register-building",verifyAuth, (req: Request, res: Response) => {
            buildingController.registerBuilding(req, res);
        });      
      this.router.put("/vendor/edit-building",verifyAuth, (req: Request, res: Response) => {
            buildingController.editBuilding(req, res);
        });     
       this.router.patch("/vendor/update-status",verifyAuth,(req: Request, res: Response) => {
            usersController.updateEntityStatus(req, res);
        });  
    }
}