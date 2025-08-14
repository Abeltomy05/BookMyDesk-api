import { NextFunction, Request, Response } from "express";
import { IChatController } from "../../entities/controllerInterfaces/others/chat-controller.interface";
import { inject, injectable } from "tsyringe";
import { StatusCodes } from "http-status-codes";
import { CustomRequest } from "../middlewares/auth.middleware";
import { ICreateSessionUseCase } from "../../entities/usecaseInterfaces/chat/create-session-usecase.interface";
import { IGetChatsUseCase } from "../../entities/usecaseInterfaces/chat/get-chat-usecase.interface";
import { IGetMessagesUseCase } from "../../entities/usecaseInterfaces/chat/get-messages-usecase.interface";
import { IClearChatUseCase } from "../../entities/usecaseInterfaces/chat/clear-chat-usecase.interface";
import { getErrorMessage } from "../../shared/error/errorHandler";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../shared/constants";

@injectable()
export class ChatController implements IChatController{
  constructor(
   @inject("ICreateSessionUseCase")
   private _createSessionUseCase:ICreateSessionUseCase,
   @inject("IGetChatsUseCase")
   private _getChatsUseCase: IGetChatsUseCase,
   @inject("IGetMessagesUseCase")
   private _getMessagesUseCase: IGetMessagesUseCase,
   @inject("IClearChatUseCase")
   private _clearChatUseCase: IClearChatUseCase,
  ){}

  async createSession(req:Request, res: Response, next: NextFunction): Promise<void>{
    try {
      const {buildingId} = req.body;
      const {userId} = (req as CustomRequest).user;

      if(!buildingId){
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message:ERROR_MESSAGES.MISSING_CREDENTIALS
        })
        return;
      } 

      const result =  await this._createSessionUseCase.execute(buildingId,userId);
      res.status(StatusCodes.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.CREATED,
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  async getChats(req:Request, res: Response, next: NextFunction): Promise<void>{
    try {
       const buildingId = typeof req.query.buildingId === 'string'
        ? req.query.buildingId
        : undefined;

       const {userId,role} = (req as CustomRequest).user;

       let data = buildingId && role === 'vendor' ? {buildingId} : {userId}
       const result = await this._getChatsUseCase.execute(data);

       res.status(StatusCodes.OK).json({
        success: true,
        data: result,
       })
    } catch (error) {
      next(error)
  }
  }

  async getMessages(req:Request, res: Response, next: NextFunction): Promise<void>{
    try {
      const sessionId = req.params.chatId as string;
      if(!sessionId){
        res.status(StatusCodes.BAD_REQUEST).json({
          success:false,
          message:ERROR_MESSAGES.FAILED
        })
        return;
      }
      const {userId} = (req as CustomRequest).user;
      const result = await this._getMessagesUseCase.execute(sessionId,userId);
      res.status(StatusCodes.OK).json({
        success:true,
        data:result,
      })
    } catch (error) {
       next(error)
    }
  }

  async clearChat(req:Request, res: Response, next: NextFunction): Promise<void>{
    try {
      const sessionId = req.params.chatId;
      if(!sessionId){
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message:ERROR_MESSAGES.MISSING_CREDENTIALS
        })
        return;
      }

      const userId = (req as CustomRequest).user.userId;
      await this._clearChatUseCase.execute(sessionId,userId);
      res.status(StatusCodes.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.CHAT_CLEARED
      })
    } catch (error) {
       next(error)
    }
  }
}