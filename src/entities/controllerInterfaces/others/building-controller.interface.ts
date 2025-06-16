import { Request, Response } from "express";

export interface IBuildingController{
    getAllBuilding(req:Request, res: Response): Promise<void>;
    registerBuilding(req:Request, res: Response): Promise<void>;
    getBuildingsForVerification(req:Request, res: Response): Promise<void>;
    editBuilding(req:Request, res: Response): Promise<void>;
    getSingleBuilding(req:Request, res: Response): Promise<void>;
}