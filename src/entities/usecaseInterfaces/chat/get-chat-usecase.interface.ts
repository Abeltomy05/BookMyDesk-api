import { ChatSessionDto } from "../../../shared/dtos/chat.dto";

export interface IGetChatsUseCase{
    execute(params: { userId?: string; buildingId?: string }):Promise<ChatSessionDto[]>;
}