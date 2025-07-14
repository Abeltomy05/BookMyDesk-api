import { injectable } from "tsyringe";
import { ChatMessageModel, IChatMessageModel } from "../../../frameworks/database/mongo/models/chatMessage.model";
import { BaseRepository } from "../base.repository";
import { IChatMessageRepository } from "../../../entities/repositoryInterfaces/chat/chat-message-repository.interface";

@injectable()
export class ChatMessageRepository extends BaseRepository<IChatMessageModel> implements IChatMessageRepository{
   constructor(){
    super(ChatMessageModel)
   }
}