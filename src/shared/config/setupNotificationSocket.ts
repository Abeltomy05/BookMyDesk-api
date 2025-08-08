import http from "http";
import { NotificationSocketHandler } from "./notificationSocket";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { ERROR_MESSAGES } from "../constants";

let notificationSocketHandlerInstance: NotificationSocketHandler | null = null;

export const initializeNotificationSocket = (server: http.Server) => {
  notificationSocketHandlerInstance = new NotificationSocketHandler(server);
  notificationSocketHandlerInstance.initialize();
};

export const getNotificationSocketHandler = (): NotificationSocketHandler => {
  if (!notificationSocketHandlerInstance) {
    throw new CustomError(ERROR_MESSAGES.NOTIFICATION_HANDLER_ERROR,StatusCodes.INTERNAL_SERVER_ERROR);
  }
  return notificationSocketHandlerInstance;
};