import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../entities/utils/custom.error";
import { inject, injectable } from "tsyringe";
import { INotificationRepository } from "../../entities/repositoryInterfaces/notification/notification-repository.interface";
import { IClearNotificationUseCase } from "../../entities/usecaseInterfaces/notification/clear-notification-usecase.interface";
import { ERROR_MESSAGES } from "../../shared/constants";

@injectable()
export class ClearNotificationUseCase implements IClearNotificationUseCase{
    constructor(
        @inject("INotificationRepository")
        private _notificationRepo: INotificationRepository, 
    ){}

    async execute(userId: string, role: string):Promise<void>{
       if(!userId || !role){
        throw new CustomError(ERROR_MESSAGES.MISSING_CREDENTIALS,StatusCodes.NOT_FOUND)
       }
       
       let userRole:'Client' | 'Vendor' | 'Admin';
       if(role === 'client') userRole = "Client"
       else if(role === 'vendor') userRole = "Vendor"
       else if(role === 'admin') userRole = 'Admin'
       else throw new CustomError(ERROR_MESSAGES.INVALID_ROLE,StatusCodes.BAD_REQUEST);

       await this._notificationRepo.deleteAll({userId,role:userRole,isRead:true});
    }
}