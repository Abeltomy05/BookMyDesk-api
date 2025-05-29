import { Request, Response } from "express";


export interface IUsersController{
    getAllUsers(req: Request, res: Response): Promise<void>;
    updateUserStatus(req: Request, res: Response): Promise<void>;
    getUserCount(req: Request, res: Response): Promise<void>;
}