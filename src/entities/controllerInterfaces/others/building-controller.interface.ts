import { Request, Response } from "express";

export interface IBuildingController{
    getAllBuilding(req:Request, res: Response): Promise<void>;
    registerBuilding(req:Request, res: Response): Promise<void>;

}