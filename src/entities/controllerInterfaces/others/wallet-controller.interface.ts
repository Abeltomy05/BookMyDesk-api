import { Request, Response } from "express";

export interface IWalletController{
    getWalletDetails(req: Request, res: Response): Promise<void>;
    payWithWallet(req: Request, res: Response): Promise<void>;
    createTopupIntent(req: Request, res: Response): Promise<void>;
    confirmTopupPayment(req: Request, res: Response): Promise<void>;
}