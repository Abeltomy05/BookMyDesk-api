import { SaveMessageDTO } from "../../../shared/dtos/chat.dto";
import { IChatMessageEntity } from "../../models/chatMessage.entity";

export interface IChatUseCase{
    saveMessage(data:SaveMessageDTO):Promise<IChatMessageEntity>;
}