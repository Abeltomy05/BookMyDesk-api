import { inject, injectable } from "tsyringe";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { IChatSessionRepository } from "../../entities/repositoryInterfaces/chat/chat-session-repository.interface";
import { Types } from "mongoose";
import { ICreateSessionUseCase } from "../../entities/usecaseInterfaces/chat/create-session-usecase.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { ERROR_MESSAGES } from "../../shared/constants";

@injectable()
export class CreateSessionUseCase implements ICreateSessionUseCase{
    constructor(
      @inject("IBuildingRepository")
      private _buildingRepo: IBuildingRepository,
      @inject("IChatSessionRepository")
      private _chatSessionRepo: IChatSessionRepository,
    ){}


    async execute(buildingId:string,userId:string):Promise<{sessionId:string}>{
        if(!userId){
            throw new CustomError(ERROR_MESSAGES.MISSING_CREDENTIALS,StatusCodes.NOT_FOUND);
        }

        const existingSession = await this._chatSessionRepo.findOne(
            {clientId:userId, buildingId}
        )

        if(existingSession){
            return {
                sessionId: existingSession._id.toString()
            }
        }else{
            const session = await this._chatSessionRepo.save({
            clientId: new Types.ObjectId(userId),
            buildingId: new Types.ObjectId(buildingId),
        })

        return{
            sessionId: session._id.toString()
        }
        }
    }
}