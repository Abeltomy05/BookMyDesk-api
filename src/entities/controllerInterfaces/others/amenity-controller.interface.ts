import { NextFunction, Request, Response } from "express";

export interface IAmenityController{
   getAllAmenity(req:Request, res: Response, next: NextFunction): Promise<void>;
   createAmenity(req:Request, res: Response, next: NextFunction): Promise<void>;
   editAmenity(req:Request, res: Response, next: NextFunction): Promise<void>;
   deleteAmenity(req:Request, res: Response, next: NextFunction): Promise<void>;
   requestAmenity(req:Request, res: Response, next: NextFunction): Promise<void>;
   getPendingAmenities(req:Request, res: Response, next: NextFunction): Promise<void>;
}