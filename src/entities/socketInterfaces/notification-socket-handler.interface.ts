export interface INotificationSocketHandler {
  emitNotification(userId: string): void;
}