import { NextFunction, Request, Response } from "express";

export interface IWalletController{
    getWalletDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
    payWithWallet(req: Request, res: Response, next: NextFunction): Promise<void>;
    createTopupIntent(req: Request, res: Response, next: NextFunction): Promise<void>;
    confirmTopupPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
}