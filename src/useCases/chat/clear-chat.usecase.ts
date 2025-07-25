import { inject, injectable } from "tsyringe";
import { IChatSessionRepository } from "../../entities/repositoryInterfaces/chat/chat-session-repository.interface";
import { IClearChatUseCase } from "../../entities/usecaseInterfaces/chat/clear-chat-usecase.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";

@injectable()
export class ClearChatUseCase implements IClearChatUseCase{
    constructor(
      @inject("IChatSessionRepository")
      private _chatSessionRepo: IChatSessionRepository,
    ){}

    async execute(sessionId:string,userId:string):Promise<void>{
        if(!sessionId || !userId){
            throw new CustomError("Session Id or user Id missing",StatusCodes.BAD_REQUEST);
        }

        const session = await this._chatSessionRepo.findOne({_id:sessionId});
        if (!session) {
        throw new CustomError("Chat session not found", StatusCodes.NOT_FOUND);
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