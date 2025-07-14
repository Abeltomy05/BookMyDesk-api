import { inject, injectable } from "tsyringe";
import { IChatSessionRepository } from "../../entities/repositoryInterfaces/chat/chat-session-repository.interface";
import { IChatSessionEntity } from "../../entities/models/chatSession.entity";
import { ChatSessionDto } from "../../shared/dtos/chat.dto";
import { IGetChatsUseCase } from "../../entities/usecaseInterfaces/chat/get-chat-usecase.interface";

@injectable()
export class GetChatsUseCase implements IGetChatsUseCase{
    constructor(
      @inject("IChatSessionRepository")
      private _chatSessionRepo: IChatSessionRepository,
    ){}

    async execute(params: { userId?: string; buildingId?: string }):Promise<ChatSessionDto[]>{
         if(params.buildingId){
             const sessions = await this._chatSessionRepo.findWithPopulate(
                { buildingId: params.buildingId },
                [{ path: 'clientId', select: 'username avatar' }]
             )

         return sessions.map((s: any) => ({
            _id: s._id.toString(),
            clientId: s.clientId
                ? {
                    _id: s.clientId._id.toString(),
                    name: s.clientId.username,
                    avatar: s.clientId.avatar,
                }
                : undefined,
            lastMessage: s.lastMessage,
            lastMessageAt: s.lastMessageAt,
            }));
         }

         if (params.userId) {
           const sessions = await this._chatSessionRepo.findWithPopulate(
                { clientId: params.userId },
                [{ path: 'buildingId', select: 'buildingName' }]
            );

            return sessions.map((s: any) => ({
                _id: s._id.toString(),
                buildingId: s.buildingId
                    ? {
                        _id: s.buildingId._id.toString(),
                        buildingName: s.buildingId.buildingName,
                    }
                    : undefined,
                lastMessage: s.lastMessage,
                lastMessageAt: s.lastMessageAt,
            })); 
         }

         return [];
    }
}