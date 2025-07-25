import { NextFunction, Request, Response } from "express";

export interface IAuthController {
    register(req: Request, res: Response, next: NextFunction): Promise<void>;
    sendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
    verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
    forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
    authWithGoogle(req:Request,res:Response):Promise<void>;
    getMe(req: Request, res: Response, next: NextFunction): Promise<void>;
    logout(req: Request, res: Response, next: NextFunction): Promise<void>;
    handleTokenRefresh(req: Request, res: Response): Promise<void>;
    saveFcmToken(req: Request, res: Response, next: NextFunction): Promise<void>;
}