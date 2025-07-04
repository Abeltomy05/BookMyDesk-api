import { Request, Response } from "express";

export interface IOfferController{
    fetchAllOffers(req:Request, res: Response): Promise<void>;
    createOffer(req:Request, res: Response): Promise<void>;
}