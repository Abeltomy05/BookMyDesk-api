import { inject, injectable } from "tsyringe";
import { IOfferRepository } from "../../entities/repositoryInterfaces/offer/offer-repository.interface";
import { IDeleteExpiredOffersUseCase } from "../../entities/usecaseInterfaces/offer/delete-expired-offer-usecase.interface";

@injectable()
export class DeleteExpiredOffersUseCase implements IDeleteExpiredOffersUseCase{
    constructor(
        @inject("IOfferRepository")
        private _offerRepo: IOfferRepository,
    ){}

    async execute(): Promise<{ deletedCount: number }> {
        const now = new Date();

        const deletedCount = await this._offerRepo.countDocuments({ endDate: { $lt: now }})
        await this._offerRepo.deleteAll({ endDate: { $lt: now } });

        return { deletedCount };
    }
}