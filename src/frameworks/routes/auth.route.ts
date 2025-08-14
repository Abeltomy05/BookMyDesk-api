import { NextFunction, Request, Response } from "express";
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

        this.router.post("/signup",(req: Request, res: Response, next: NextFunction) => {
            authController.register(req, res, next);
         });

         this.router.post("/login", (req: Request, res: Response, next: NextFunction) => {
            authController.login(req, res, next);
         });
         this.router.post("/fcm-token", (req: Request, res: Response, next: NextFunction) => {
            authController.saveFcmToken(req, res, next);
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

         this.router.get('/me', (req: Request, res: Response, next: NextFunction) => {
            authController.getMe(req, res, next);
         })   

        //*========================================================
        //*               🗡️ OTP ENDPOINTS 🗡️
        //*========================================================

        this.router.post("/otp/send", (req: Request, res: Response, next: NextFunction) => {
            authController.sendOtp(req, res, next);
         });

        this.router.post("/otp/verify", (req: Request, res: Response, next: NextFunction) => {
            authController.verifyOtp(req, res, next);
         }); 

         //*========================================================
        //*               🗡️ Password ENDPOINTS 🗡️
        //*========================================================
       
        this.router.post("/password/forgot", (req: Request, res: Response, next: NextFunction) => {
            authController.forgotPassword(req, res, next);
         });

        this.router.post("/password/reset", (req: Request, res: Response, next: NextFunction) => {
         authController.resetPassword(req, res, next);
    });
     }
}