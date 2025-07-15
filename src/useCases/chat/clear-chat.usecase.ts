import { inject, injectable } from "tsyringe";
import { IChatSessionRepository } from "../../entities/repositoryInterfaces/chat/chat-session-repository.interface";
import { IClearChatUseCase } from "../../entities/usecaseInterfaces/chat/clear-chat-usecase.interface";

@injectable()
export class ClearChatUseCase implements IClearChatUseCase{
    constructor(
      @inject("IChatSessionRepository")
      private _chatSessionRepo: IChatSessionRepository,
    ){}

    async execute(sessionId:string,userId:string):Promise<void>{
        if(!sessionId || !userId){
            throw new Error("Session Id or user Id missing")
        }

        const session = await this._chatSessionRepo.findOne({_id:sessionId});
        if (!session) {
        throw new Error("Chat session not found");
        }

        const clearedAt = new Date();
        const updatedClearedAtBy = {
            ...(session.clearedAtBy || {}),
            [userId]: clearedAt,
        };

         await this._chatSessionRepo.update({ _id: sessionId }, {
            clearedAtBy: updatedClearedAtBy,
         });
    }
}