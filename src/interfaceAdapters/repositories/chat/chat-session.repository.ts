import { injectable } from "tsyringe";
import { BaseRepository } from "../base.repository";
import { ChatSessionModel, IChatSessionModel } from "../../../frameworks/database/mongo/models/chatSession.model";
import { IChatSessionRepository } from "../../../entities/repositoryInterfaces/chat/chat-session-repository.interface";

@injectable()
export class ChatSessionRepository extends BaseRepository<IChatSessionModel> implements IChatSessionRepository{
   constructor(){
    super(ChatSessionModel)
   }
}