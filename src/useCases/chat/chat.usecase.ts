import { inject, injectable } from "tsyringe";
import { IChatUseCase } from "../../entities/usecaseInterfaces/chat/chat-usecase.interface";
import { SaveMessageDTO } from "../../shared/dtos/chat.dto";
import { IChatMessageRepository } from "../../entities/repositoryInterfaces/chat/chat-message-repository.interface";
import { Types } from "mongoose";
import { IChatMessageEntity } from "../../entities/models/chatMessage.entity";
import { INotificationService } from "../../entities/serviceInterfaces/notification-service.interface";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { IChatSessionRepository } from "../../entities/repositoryInterfaces/chat/chat-session-repository.interface";

@injectable()
export class ChatUseCase implements IChatUseCase{
    constructor(
      @inject("IChatMessageRepository")
      private _chatMessageRepo: IChatMessageRepository,
      @inject("IChatSessionRepository")
      private _chatSessionRepo: IChatSessionRepository,
      @inject("INotificationService")
      private _notificationService: INotificationService,
      @inject("IBuildingRepository")
      private _buildingRepo: IBuildingRepository,
    ){}

    async saveMessage(data:SaveMessageDTO):Promise<IChatMessageEntity>{
       if(!data.senderId || !data.receiverId || !data.senderModel || !data.receiverModel){
        throw new CustomError("Message credentials missing.",StatusCodes.BAD_REQUEST);
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

       await this._chatSessionRepo.update(
          { _id: data.sessionId },
          {
            $set: {
              lastMessage: data.text || "📷 Photo",
              lastMessageAt: new Date(),
            },
          }
        );

        const role = data.receiverModel === 'Building' ? 'vendor' : 'client';
        let finalReceiverId = data.receiverId;
        let notificationBody = "You have received a new message in chat.";

          if (role === 'vendor') {
            const building = await this._buildingRepo.findOne(
              { _id: data.receiverId },
              { _id: 0, vendorId: 1, buildingName: 1 }
            );
            if (building?.vendorId) {
              finalReceiverId = building.vendorId.toString();
              notificationBody = `You have received a new message in chat for building "${building.buildingName}".`;
            } else {
              console.warn(`⚠️ Vendor ID not found for building ${data.receiverId}`);
            }
          }
       
       await this._notificationService.sendToUser(
          finalReceiverId,
          role,
          "New Chat Message",
          notificationBody,
          {type: "chat", sessionId: data.sessionId, senderId: data.senderId}
        );

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
        throw new CustomError("Cannot delete message without user Id.",StatusCodes.BAD_REQUEST);
      }

      await this._chatMessageRepo.update(
        {_id: data.messageId, sessionId:data.sessionId},
        { isDeleted:true }
    );
    }

}