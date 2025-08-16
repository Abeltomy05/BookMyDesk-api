import { NextFunction, Request, Response } from "express";

export interface IBuildingController{
    getAllBuilding(req:Request, res: Response, next: NextFunction): Promise<void>;
    registerBuilding(req:Request, res: Response, next: NextFunction): Promise<void>;
    getBuildingsForVerification(req:Request, res: Response, next: NextFunction): Promise<void>;
    editBuilding(req:Request, res: Response, next: NextFunction): Promise<void>;
    getSingleBuilding(req:Request, res: Response, next: NextFunction): Promise<void>;
    fetchBuildings(req:Request, res: Response, next: NextFunction): Promise<void>;
    fetchFilters(req: Request, res: Response, next: NextFunction): Promise<void>;
    getEveryBuilding(req: Request, res: Response, next: NextFunction): Promise<void>;
    reapplyBuildingData(req: Request, res: Response, next: NextFunction): Promise<void>
    retryBuildingRegistration(req: Request, res: Response, next: NextFunction): Promise<void>
    buildingsForClient(req: Request, res: Response, next: NextFunction): Promise<void>
}