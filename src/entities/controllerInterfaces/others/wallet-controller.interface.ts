import { Request, Response } from "express";

export interface IWalletController{
    getWalletDetails(req: Request, res: Response): Promise<void>;
}