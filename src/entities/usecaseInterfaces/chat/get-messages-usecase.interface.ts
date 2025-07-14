import { GetMessageDTO } from "../../../shared/dtos/chat.dto";

export interface IGetMessagesUseCase{
    execute(sessionId:string,userId:string):Promise<GetMessageDTO[]>
}