import { inject, injectable } from "tsyringe";
import { IDeleteEntityUseCase } from "../../entities/usecaseInterfaces/users/delete-entity-usecase.interface";
import { IOfferRepository } from "../../entities/repositoryInterfaces/offer/offer-repository.interface";


@injectable()
export class DeleteEntityUseCase implements IDeleteEntityUseCase{
    constructor(
       @inject("IOfferRepository")
       private _offerRepo: IOfferRepository,
    ){}

    async execute(entityId:string, entityType:string):Promise<{success:boolean}>{
       if(!entityType || !entityId){
        throw new Error("Entity credentials missing. Please try again.");
       }

       let repo: { delete: (query: any) => Promise<any> };

       switch(entityType){
        case "offer"  :
            repo = this._offerRepo;
            break;
        default:
			throw new Error("Unsupported entity type"); 
       }

       await repo.delete({ _id: entityId });
       return {success: true};
    }
}