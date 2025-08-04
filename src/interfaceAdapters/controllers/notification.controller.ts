import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomRequest } from "../middlewares/auth.middleware";
import { INotificationController } from "../../entities/controllerInterfaces/others/notification-controller.interface";
import { inject, injectable } from "tsyringe";
import { IGetNotificationsUseCase } from "../../entities/usecaseInterfaces/notification/get-notification-usecase.interface";
import { IMarkAsReadUseCase } from "../../entities/usecaseInterfaces/notification/mark-as-read-usecase.interface";
import { IClearNotificationUseCase } from "../../entities/usecaseInterfaces/notification/clear-notification-usecase.interface";

@injectable()
export class NotificationController implements INotificationController{
    constructor(
     @inject("IGetNotificationsUseCase")
     private _getNotificationUseCase: IGetNotificationsUseCase,
     @inject("IMarkAsReadUseCase")
     private _markAdReadUseCase: IMarkAsReadUseCase,
     @inject("IClearNotificationUseCase")
     private _clearNotificationUseCase: IClearNotificationUseCase,
    ){}

    async getNotifications(req:Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const page = parseInt(req.query.page as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;
            const filter = (req.query.filter as "unread" | "all") || "all";

            const userId = (req as CustomRequest).user.userId;
            const response = await this._getNotificationUseCase.execute(page,limit,filter,userId);

            res.status(StatusCodes.OK).json({
                success:true,
                data:response,
            })
        } catch (error) {
        next(error)
        }
    }
    async markAsRead(req:Request, res: Response, next: NextFunction): Promise<void>{
        try {
            let id:string | undefined = req.params.id;
            const userId = ( req as CustomRequest ).user.userId;
            
            if (!id || id === 'undefined') {
              id = undefined;
            }

            await this._markAdReadUseCase.execute(id, userId);
            res.status(StatusCodes.OK).json({
                success:true
            })
        } catch (error) {
         next(error)
        }
    }
    async clearNotification(req:Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const { userId,role } = (req as CustomRequest).user;
            await this._clearNotificationUseCase.execute(userId,role);
            
            res.status(StatusCodes.OK).json({
                success: true,
            })
        } catch (error) {
            next(error)
        }
    }
}