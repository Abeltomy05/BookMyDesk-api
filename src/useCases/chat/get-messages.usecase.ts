import { inject, injectable } from "tsyringe";
import { IChatMessageRepository } from "../../entities/repositoryInterfaces/chat/chat-message-repository.interface";
import { GetMessageDTO } from "../../shared/dtos/chat.dto";
import { IGetMessagesUseCase } from "../../entities/usecaseInterfaces/chat/get-messages-usecase.interface";

@injectable()
export class GetMessagesUseCase implements IGetMessagesUseCase{
    constructor(
     @inject("IChatMessageRepository")
     private _chatMessageRepo: IChatMessageRepository,
    ){}

    async execute(sessionId:string,userId:string):Promise<GetMessageDTO[]>{
      const filter = {
        sessionId,
        $or: [
            { isDeletedFor: { $exists: false } },
            { isDeletedFor: { $ne: userId } }
        ]
      };

      const projection = {
        _id: 1,
        senderId: 1,
        receiverId: 1,
        text: 1,
        image:1,
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