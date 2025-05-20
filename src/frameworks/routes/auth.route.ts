import { NextFunction, Request, Response } from "express";
import { ParsedQs } from "qs";
import { BaseRoute } from "./base.route";
import { authController } from "../di/resolver";
import passport from "passport";


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

         this.router.get("/google",(req,res,next) => {
             const roleParam = req.query.role;
             let role: string | undefined;

             if (typeof roleParam === 'string') {
                  role = roleParam;
               } else if (Array.isArray(roleParam)) {
                   role = roleParam.find(item => typeof item === "string") as string | undefined;
               } else if (typeof roleParam === "object" && roleParam !== null) {
                   role = undefined;
               }else {
                  role = undefined;
               }

             passport.authenticate('google', { 
               scope: ['profile', 'email'],
               state: role, 
            })(req, res, next);
         });

         this.router.get('/google/callback', (req: Request, res: Response, next: NextFunction) => {
            passport.authenticate('google', (err: any, user: any, info: any) => {
               if (err) return next(err);

               if (!user) return res.redirect('/login');

               const roleFromState = req.query.state as string;

               if (user && roleFromState) {
                  (user as any).role = roleFromState;
               }

               req.user = user;
               next();
            })(req, res, next);
            }, (req, res) => {
            authController.authWithGoogle(req, res);
            });

         this.router.get('/me', (req: Request, res: Response) => {
            authController.getMe(req, res);
         })   

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