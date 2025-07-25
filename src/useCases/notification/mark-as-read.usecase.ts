import { inject, injectable } from "tsyringe";
import { INotificationRepository } from "../../entities/repositoryInterfaces/notification/notification-repository.interface";
import { IMarkAsReadUseCase } from "../../entities/usecaseInterfaces/notification/mark-as-read-usecase.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";

@injectable()
export class MarkAsReadUseCase implements IMarkAsReadUseCase{
    constructor(
     @inject("INotificationRepository")
     private _notificationRepo: INotificationRepository, 
    ){}

    async execute(id:string):Promise<void>{
       if(!id) throw new CustomError("Notification Id missing, Please try again.",StatusCodes.BAD_REQUEST);

       await this._notificationRepo.update({_id:id},{isRead:true});
    }
}