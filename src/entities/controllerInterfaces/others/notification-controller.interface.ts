import { NextFunction, Request, Response } from "express";

export interface INotificationController{
    getNotifications(req:Request, res: Response, next: NextFunction): Promise<void>;
    markAsRead(req:Request, res: Response, next: NextFunction): Promise<void>;
    clearNotification(req:Request, res: Response, next: NextFunction): Promise<void>
}