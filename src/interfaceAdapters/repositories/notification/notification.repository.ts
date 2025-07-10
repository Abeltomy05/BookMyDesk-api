import { injectable } from "tsyringe";
import { BaseRepository } from "../base.repository";
import { INotificationModel, NotificationModel } from "../../../frameworks/database/mongo/models/notification.model";
import { INotificationRepository } from "../../../entities/repositoryInterfaces/notification/notification-repository.interface";

@injectable()
export class NotificationRepository extends BaseRepository<INotificationModel> implements INotificationRepository{
   constructor(){
    super(NotificationModel)
   }
}