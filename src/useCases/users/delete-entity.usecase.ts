import { inject, injectable } from "tsyringe";
import { IDeleteEntityUseCase } from "../../entities/usecaseInterfaces/users/delete-entity-usecase.interface";
import { IOfferRepository } from "../../entities/repositoryInterfaces/offer/offer-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { ERROR_MESSAGES } from "../../shared/constants";


@injectable()
export class DeleteEntityUseCase implements IDeleteEntityUseCase{
    constructor(
       @inject("IOfferRepository")
       private _offerRepo: IOfferRepository,
    ){}

    async execute(entityId:string, entityType:string):Promise<{success:boolean}>{
       if(!entityType || !entityId){
        throw new CustomError(ERROR_MESSAGES.MISSING_CREDENTIALS,StatusCodes.BAD_REQUEST);
       }

       let repo: { delete: (query: any) => Promise<any> };

       switch(entityType){
        case "offer"  :
            repo = this._offerRepo;
            break;
        default:
			throw new CustomError(ERROR_MESSAGES.INVALID_ENTITY_TYPE, StatusCodes.BAD_REQUEST); 
       }

       await repo.delete({ _id: entityId });
       return {success: true};
    }
}