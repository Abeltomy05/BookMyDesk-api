import { NextFunction, Request, Response } from "express";


export interface IUsersController{
    getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUserData(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateEntityStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUserCount(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateUserProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateUserPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    getVendorsAndBuildings(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteEntity(req:Request, res: Response, next: NextFunction): Promise<void>;
    getMonthlyBookingStats(req:Request, res: Response, next: NextFunction): Promise<void>;
}