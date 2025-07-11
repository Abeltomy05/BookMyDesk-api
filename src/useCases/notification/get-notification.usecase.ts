import { inject, injectable } from "tsyringe";
import { INotificationEntity } from "../../entities/models/notification.entity";
import { INotificationRepository } from "../../entities/repositoryInterfaces/notification/notification-repository.interface";
import { IGetNotificationsUseCase } from "../../entities/usecaseInterfaces/notification/get-notification-usecase.interface";
import { GetNotificationsResponseDTO } from "../../shared/dtos/notification.dto";

@injectable()
export class GetNotificationsUseCase implements IGetNotificationsUseCase{
    constructor(
      @inject("INotificationRepository")
      private _notificationRepo: INotificationRepository,
    ){}

    async execute(page:number,limit:number,filter: "unread" | "all",userId:string): Promise<GetNotificationsResponseDTO>{
      if(!userId) throw new Error("UserId missing, Please contact support.");

      const skip = page * limit;
      const baseFilter: any = { userId }; 
      const queryFilter = filter === "unread" ? { ...baseFilter, isRead: false } : baseFilter;

        const [{ items, total: filteredTotal }, totalCount, unreadCount] = await Promise.all([
            this._notificationRepo.findAll(queryFilter, skip, limit, { createdAt: -1 }),
            this._notificationRepo.countDocuments(baseFilter), 
            this._notificationRepo.countDocuments({ ...baseFilter, isRead: false }), 
        ]);

        const formattedItems = items.map((item) => ({
            ...item,
            _id: item._id.toString(),
            userId: item.userId.toString(),
        }));
    
        return {
            items: formattedItems,
            hasMore: skip + limit < filteredTotal,
            totalCount,
            unreadCount,
        };
}
}