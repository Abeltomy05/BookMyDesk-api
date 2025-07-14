import { IChatMessageModel } from "../../../frameworks/database/mongo/models/chatMessage.model";
import { IBaseRepository } from "../base-repository.interface";

export interface IChatMessageRepository extends IBaseRepository<IChatMessageModel> {

}