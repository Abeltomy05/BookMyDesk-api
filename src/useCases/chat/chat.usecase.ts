import { inject, injectable } from "tsyringe";
import { IChatUseCase } from "../../entities/usecaseInterfaces/chat/chat-usecase.interface";
import { SaveMessageDTO } from "../../shared/dtos/chat.dto";
import { IChatMessageRepository } from "../../entities/repositoryInterfaces/chat/chat-message-repository.interface";
import { Types } from "mongoose";
import { IChatMessageEntity } from "../../entities/models/chatMessage.entity";

@injectable()
export class ChatUseCase implements IChatUseCase{
    constructor(
      @inject("IChatMessageRepository")
      private _chatMessageRepo: IChatMessageRepository
    ){}

    async saveMessage(data:SaveMessageDTO):Promise<IChatMessageEntity>{
       if(!data.senderId || !data.receiverId || !data.senderModel || !data.receiverModel){
        throw new Error("Message credentials missing.");
       }

       const savedMessage = await this._chatMessageRepo.save({
        sessionId: new Types.ObjectId(data.sessionId),
        senderId: new Types.ObjectId(data.senderId),
        receiverId: new Types.ObjectId(data.receiverId),
        senderModel: data.senderModel,
        receiverModel: data.receiverModel,
        text: data.text,
        image: data.image,
       })

        return {
            _id: savedMessage._id.toString(),
            sessionId: savedMessage.sessionId.toString(),
            senderId: savedMessage.senderId.toString(),
            receiverId: savedMessage.receiverId.toString(),
            senderModel: savedMessage.senderModel,
            receiverModel: savedMessage.receiverModel,
            text: savedMessage.text,
            image: savedMessage.image,
            isDeleted: savedMessage.isDeleted,
            createdAt: savedMessage.createdAt,
            updatedAt: savedMessage.updatedAt,
        };

    }

    async deleteMessage(data:{messageId: string, sessionId: string},userId: string){
      if(!userId){
        throw new Error("Cannot delete message without user Id.");
      }

      await this._chatMessageRepo.update(
        {_id: data.messageId, sessionId:data.sessionId},
        { isDeleted:true }
    );
    }

    async clearChat(sessionId:string){
        
    }
}