import { inject, injectable } from "tsyringe";
import { INotificationRepository } from "../../entities/repositoryInterfaces/notification/notification-repository.interface";
import { IMarkAsReadUseCase } from "../../entities/usecaseInterfaces/notification/mark-as-read-usecase.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { ERROR_MESSAGES } from "../../shared/constants";

@injectable()
export class MarkAsReadUseCase implements IMarkAsReadUseCase{
    constructor(
     @inject("INotificationRepository")
     private _notificationRepo: INotificationRepository, 
    ){}

    async execute(id?: string, userId?: string):Promise<void>{
       if (id != undefined) {
        await this._notificationRepo.update({ _id: id }, { isRead: true });

        } else if (id === undefined && userId) {
        await this._notificationRepo.updateAll({ userId }, { isRead: true });
        
        } else {
        throw new CustomError(ERROR_MESSAGES.MISSING_CREDENTIALS, StatusCodes.BAD_REQUEST);
        }
    }
}