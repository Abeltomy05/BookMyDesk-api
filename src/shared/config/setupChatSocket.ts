import http from "http";
import { ChatSocketHandler } from "./socket"; 
import { IChatUseCase } from "../../entities/usecaseInterfaces/chat/chat-usecase.interface";

let chatSocketHandlerInstance: ChatSocketHandler | null = null;

export const initializeChatSocket = (server: http.Server, chatUseCase: IChatUseCase) => {
  chatSocketHandlerInstance = new ChatSocketHandler(server, chatUseCase);
  chatSocketHandlerInstance.initialize();
};

export const getChatSocketHandler = (): ChatSocketHandler => {
  if (!chatSocketHandlerInstance) {
    throw new Error("ChatSocketHandler not initialized.");
  }
  return chatSocketHandlerInstance;
};