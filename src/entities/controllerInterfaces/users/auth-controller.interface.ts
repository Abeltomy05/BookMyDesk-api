import { Request, Response } from "express";

export interface IAuthController {
    register(req: Request, res: Response): Promise<void>;
    sendOtp(req: Request, res: Response): Promise<void>;
    verifyOtp(req: Request, res: Response): Promise<void>;
    forgotPassword(req: Request, res: Response): Promise<void>;
    resetPassword(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    authWithGoogle(req:Request,res:Response):Promise<void>;
    getMe(req: Request, res: Response): Promise<void> 
}