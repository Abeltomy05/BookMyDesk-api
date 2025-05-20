import { injectable } from "tsyringe";
import { IClientRepository } from "../../../entities/repositoryInterfaces/users/client-repository.interface";
import { ClientModel, IClientModel } from "../../../frameworks/database/mongo/models/client.model";
import { BaseRepository } from "../base.repository";

@injectable()
export class ClientRepository extends BaseRepository<IClientModel> implements IClientRepository {
     constructor() {
    super(ClientModel);
  }


}