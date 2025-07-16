import { Request, Response } from "express";
import { IChatController } from "../../entities/controllerInterfaces/others/chat-controller.interface";
import { inject, injectable } from "tsyringe";
import { StatusCodes } from "http-status-codes";
import { CustomRequest } from "../middlewares/auth.middleware";
import { ICreateSessionUseCase } from "../../entities/usecaseInterfaces/chat/create-session-usecase.interface";
import { IGetChatsUseCase } from "../../entities/usecaseInterfaces/chat/get-chat-usecase.interface";
import { IGetMessagesUseCase } from "../../entities/usecaseInterfaces/chat/get-messages-usecase.interface";
import { IClearChatUseCase } from "../../entities/usecaseInterfaces/chat/clear-chat-usecase.interface";
import { getErrorMessage } from "../../shared/error/errorHandler";

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

  async createSession(req:Request, res: Response): Promise<void>{
    try {
      const {buildingId} = req.body;
      const {userId} = (req as CustomRequest).user;

      if(!buildingId){
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message:"Credentials missing for creating session."
        })
        return;
      } 

      const result =  await this._createSessionUseCase.execute(buildingId,userId);
      res.status(StatusCodes.OK).json({
        success: true,
        message: "Session created successfully.",
        data: result,
      })
    } catch (error:unknown) {
       const message = getErrorMessage(error);
        console.error("Error creating session:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message,
    });
    }
  }

  async getChats(req:Request, res: Response): Promise<void>{
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
    } catch (error:unknown) {
       const message = getErrorMessage(error);
        console.error("Error getting chats:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message,
    });
  }
  }

  async getMessages(req:Request, res: Response): Promise<void>{
    try {
      const sessionId = req.query.sessionId as string;
      if(!sessionId){
        res.status(StatusCodes.BAD_REQUEST).json({
          success:false,
          message:"Failed to get messages."
        })
        return;
      }
      const {userId} = (req as CustomRequest).user;
      const result = await this._getMessagesUseCase.execute(sessionId,userId);
      res.status(StatusCodes.OK).json({
        success:true,
        data:result,
      })
    } catch (error:unknown) {
       const message = getErrorMessage(error);
        console.error("Error getting messages:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message,
    });
    }
  }

  async clearChat(req:Request, res: Response): Promise<void>{
    try {
      const {sessionId} = req.body;
      if(!sessionId){
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "SessionId missing."
        })
        return;
      }

      const userId = (req as CustomRequest).user.userId;
      await this._clearChatUseCase.execute(sessionId,userId);
      res.status(StatusCodes.OK).json({
        success: true,
        message: "Chat cleared successfully."
      })
    } catch (error:unknown) {
        const message = getErrorMessage(error);
        console.error("Error clearing chats:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message,
    });
    }
  }
}