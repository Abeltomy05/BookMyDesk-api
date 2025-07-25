import http from "http";
import { NotificationSocketHandler } from "./notificationSocket";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";

let notificationSocketHandlerInstance: NotificationSocketHandler | null = null;

export const initializeNotificationSocket = (server: http.Server) => {
  notificationSocketHandlerInstance = new NotificationSocketHandler(server);
  notificationSocketHandlerInstance.initialize();
};

export const getNotificationSocketHandler = (): NotificationSocketHandler => {
  if (!notificationSocketHandlerInstance) {
    throw new CustomError("NotificationSocketHandler not initialized.",StatusCodes.INTERNAL_SERVER_ERROR);
  }
  return notificationSocketHandlerInstance;
};