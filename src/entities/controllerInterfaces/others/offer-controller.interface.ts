import { NextFunction, Request, Response } from "express";

export interface IOfferController{
    fetchAllOffers(req:Request, res: Response, next: NextFunction): Promise<void>;
    createOffer(req:Request, res: Response, next: NextFunction): Promise<void>;
}