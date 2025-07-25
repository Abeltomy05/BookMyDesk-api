import { NextFunction, Request, Response } from "express";

export interface IVendorController {
    uploadIdProof(req: Request, res: Response, next: NextFunction): Promise<void>;
    getRetryData(req: Request, res: Response, next: NextFunction): Promise<void>;
    retryRegistration(req: Request, res: Response, next: NextFunction): Promise<void>;
    vendorHomeData(req: Request, res: Response, next: NextFunction): Promise<void>;
    singleVendorData(req: Request, res: Response, next: NextFunction): Promise<void>;
    fetchBuildingsForVendor(req: Request, res: Response, next: NextFunction): Promise<void>
    fetchSpaceForBuilding(req: Request, res: Response, next: NextFunction): Promise<void>
}