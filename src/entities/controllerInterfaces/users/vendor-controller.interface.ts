import { Request, Response } from "express";

export interface IVendorController {
    uploadIdProof(req: Request, res: Response): Promise<void>;
}