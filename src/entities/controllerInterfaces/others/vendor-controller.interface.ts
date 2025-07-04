import { Request, Response } from "express";

export interface IVendorController {
    uploadIdProof(req: Request, res: Response): Promise<void>;
    getRetryData(req: Request, res: Response): Promise<void>;
    retryRegistration(req: Request, res: Response): Promise<void>;
    vendorHomeData(req: Request, res: Response): Promise<void>;
    singleVendorData(req: Request, res: Response): Promise<void>;
    fetchBuildingsForVendor(req: Request, res: Response): Promise<void>
    fetchSpaceForBuilding(req: Request, res: Response): Promise<void>
}