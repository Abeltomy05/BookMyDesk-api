import { GetNotificationsResponseDTO } from "../../../shared/dtos/notification.dto";
import { INotificationEntity } from "../../models/notification.entity";

export interface IGetNotificationsUseCase{
    execute(page:number,limit:number,filter: "unread" | "all",userId:string): Promise<GetNotificationsResponseDTO>
}