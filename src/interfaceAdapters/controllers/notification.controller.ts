import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomRequest } from "../middlewares/auth.middleware";
import { INotificationController } from "../../entities/controllerInterfaces/others/notification-controller.interface";
import { inject, injectable } from "tsyringe";
import { IGetNotificationsUseCase } from "../../entities/usecaseInterfaces/notification/get-notification-usecase.interface";
import { IMarkAsReadUseCase } from "../../entities/usecaseInterfaces/notification/mark-as-read-usecase.interface";
import { getErrorMessage } from "../../shared/error/errorHandler";

@injectable()
export class NotificationController implements INotificationController{
    constructor(
     @inject("IGetNotificationsUseCase")
     private _getNotificationUseCase: IGetNotificationsUseCase,
     @inject("IMarkAsReadUseCase")
     private _markAdReadUseCase: IMarkAsReadUseCase,
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
            const id = req.params.id;
            if(!id){
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                })
                return;
            }
            await this._markAdReadUseCase.execute(id);
            res.status(StatusCodes.OK).json({
                success:true
            })
        } catch (error) {
         next(error)
        }
    }
}