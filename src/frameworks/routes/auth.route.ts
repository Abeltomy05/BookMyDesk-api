import { Request, Response } from "express";
import { BaseRoute } from "./base.route";
import { authController } from "../di/resolver";


export class AuthRoutes extends BaseRoute{
     constructor() {
      super();
     }

     protected initializeRoutes(): void {

        //*========================================================
        //*               🗡️ AUTHENTICATION ROUTES 🗡️
        //*========================================================

        this.router.post("/signup", (req: Request, res: Response) => {
            authController.register(req, res);
         });

         this.router.post("/login", (req: Request, res: Response) => {
            authController.login(req, res);
         });

        //*========================================================
        //*               🗡️ OTP ENDPOINTS 🗡️
        //*========================================================

        this.router.post("/send-otp", (req: Request, res: Response) => {
            authController.sendOtp(req, res);
         });

        this.router.post("/verify-otp", (req: Request, res: Response) => {
            authController.verifyOtp(req, res);
         }); 

         //*========================================================
        //*               🗡️ Password ENDPOINTS 🗡️
        //*========================================================
       
        this.router.post("/forgot-password", (req: Request, res: Response) => {
            authController.forgotPassword(req, res);
         });

        this.router.post("/reset-password", (req: Request, res: Response) => {
         authController.resetPassword(req, res);
    });
     }
}