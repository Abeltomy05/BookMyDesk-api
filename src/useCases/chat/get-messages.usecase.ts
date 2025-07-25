import { inject, injectable } from "tsyringe";
import { FilterQuery } from "mongoose";
import { IChatMessageRepository } from "../../entities/repositoryInterfaces/chat/chat-message-repository.interface";
import { GetMessageDTO } from "../../shared/dtos/chat.dto";
import { IGetMessagesUseCase } from "../../entities/usecaseInterfaces/chat/get-messages-usecase.interface";
import { IChatSessionRepository } from "../../entities/repositoryInterfaces/chat/chat-session-repository.interface";
import { IChatMessageEntity } from "../../entities/models/chatMessage.entity";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";

@injectable()
export class GetMessagesUseCase implements IGetMessagesUseCase{
    constructor(
     @inject("IChatMessageRepository")
     private _chatMessageRepo: IChatMessageRepository,
     @inject("IChatSessionRepository")
     private _chatSessionRepo: IChatSessionRepository,
    ){}

    async execute(sessionId:string,userId:string):Promise<GetMessageDTO[]>{
       if (!sessionId || !userId) {
          throw new CustomError("Session ID or User ID missing",StatusCodes.BAD_REQUEST);
        }

        const session = await this._chatSessionRepo.findOne({ _id: sessionId });
        if (!session) {
          throw new CustomError("Chat session not found", StatusCodes.NOT_FOUND);
        }

        const clearedAtForUser = session.clearedAtBy?.[userId];

      const filter:FilterQuery<IChatMessageEntity> = {
        sessionId,
      };

       if (clearedAtForUser) {
          filter.createdAt = { $gt: new Date(clearedAtForUser) };
        }

      const projection = {
        _id: 1,
        senderId: 1,
        receiverId: 1,
        text: 1,
        image:1,
        isDeleted: 1,
        createdAt: 1,
      };

      const messages = await this._chatMessageRepo.find(filter, projection) ?? [];
      return messages.map((msg) => ({
            ...msg,
            _id: msg._id.toString(),
            senderId: msg.senderId.toString(),
            receiverId: msg.receiverId.toString(),
       }));
    }
}