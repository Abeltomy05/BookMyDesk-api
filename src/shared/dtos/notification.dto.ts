import { INotificationEntity } from "../../entities/models/notification.entity";

export interface GetNotificationsResponseDTO {
  items: INotificationEntity[];
  hasMore: boolean;
  totalCount: number;
  unreadCount: number;
}