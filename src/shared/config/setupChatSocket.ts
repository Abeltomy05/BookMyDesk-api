import http from "http";
import { ChatSocketHandler } from "./socket"; 
import { IChatUseCase } from "../../entities/usecaseInterfaces/chat/chat-usecase.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";

let chatSocketHandlerInstance: ChatSocketHandler | null = null;

export const initializeChatSocket = (server: http.Server, chatUseCase: IChatUseCase) => {
  chatSocketHandlerInstance = new ChatSocketHandler(server, chatUseCase);
  chatSocketHandlerInstance.initialize();
};

export const getChatSocketHandler = (): ChatSocketHandler => {
  if (!chatSocketHandlerInstance) {
    throw new CustomError("ChatSocketHandler not initialized.",StatusCodes.INTERNAL_SERVER_ERROR);
  }
  return chatSocketHandlerInstance;
};