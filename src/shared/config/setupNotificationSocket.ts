import http from "http";
import { NotificationSocketHandler } from "./notificationSocket";

let notificationSocketHandlerInstance: NotificationSocketHandler | null = null;

export const initializeNotificationSocket = (server: http.Server) => {
  notificationSocketHandlerInstance = new NotificationSocketHandler(server);
  notificationSocketHandlerInstance.initialize();
};

export const getNotificationSocketHandler = (): NotificationSocketHandler => {
  if (!notificationSocketHandlerInstance) {
    throw new Error("NotificationSocketHandler not initialized.");
  }
  return notificationSocketHandlerInstance;
};