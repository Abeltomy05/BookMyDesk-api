import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IUpdateEntityStatusUseCase } from "../../entities/usecaseInterfaces/users/update-user-status-usecase.interface";
import { IEmailService } from "../../entities/serviceInterfaces/email-service.interface";
import { IJwtService } from "../../entities/serviceInterfaces/jwt-service.interface";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { hasEmail } from "../../shared/helper/hasEmail";
import { config } from "../../shared/config";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { IAmenityRepository } from "../../entities/repositoryInterfaces/building/amenity-repository.interface";
import { ERROR_MESSAGES } from "../../shared/constants";



@injectable()
export class UpdateEntityStatusUseCase  implements IUpdateEntityStatusUseCase {
	constructor(
		@inject("IClientRepository")
		private _clientRepository: IClientRepository,
		@inject("IVendorRepository")
		private _vendorRepository: IVendorRepository,
		@inject("IBuildingRepository")
		private _buildingRepository: IBuildingRepository,
		@inject("IBookingRepository")
		private _bookingRepository: IBookingRepository,
		@inject("IAmenityRepository")
		private _amenityRepository: IAmenityRepository,
		@inject("IEmailService")
	    private _emailService: IEmailService, 
		@inject("IJwtService")
	    private _tokenService: IJwtService, 
	) {}
	async execute(entityType: string, entityId: string, status: string, reason?: string, email?:string): Promise<void> {
		if (!entityType || !entityId || !status) {
			throw new CustomError(ERROR_MESSAGES.MISSING_CREDENTIALS,StatusCodes.BAD_REQUEST);
			}
		let repo;

		 switch (entityType) {
			case "client":
			repo = this._clientRepository;
			break;
			case "vendor":
			repo = this._vendorRepository;
			break;
			case "building":
			repo = this._buildingRepository;
			break;
			case "booking":
			repo = this._bookingRepository;
			break;
			case "amenity":
			repo = this._amenityRepository;
			break;

			default:
			throw new CustomError(ERROR_MESSAGES.INVALID_ENTITY_TYPE, StatusCodes.BAD_REQUEST);
		}
		const entity  = await repo.findOne({ _id: entityId  });

		if (!entity) {
			throw new CustomError(`${entityType} ${ERROR_MESSAGES.ENTITY_NOT_FOUND}`, StatusCodes.NOT_FOUND);
		}

		await repo.update({ _id: entityId },{status:status});

		  if (entityType === "vendor" && status === "rejected" && reason && hasEmail(entity)) {
            await this._handleVendorRejection(entity.email, reason);
        }

		  if (entityType === "amenity" && status === "rejected" && reason && email) {
            await this._handleAmenityRejection(email,reason);
           }


		 if (entityType === "building" && status === "rejected" && reason && hasEmail(entity)) {
            await this._handleBuildingRejection(entity.email, reason, entityId);
        }
	}

	 private async _handleVendorRejection(email: string, reason: string): Promise<void> {
        const retryToken = this._tokenService.generateResetToken(email);
        const retryUrl = new URL(`/vendor/retry/${retryToken}`, config.CORS_ORIGIN).toString();
        await this._emailService.sendRejectionEmail(email, reason, retryUrl, "Vendor Application");
    }

	  private async _handleBuildingRejection(email: string, reason: string,entityId:string): Promise<void> {
		const retryToken = this._tokenService.generateResetToken(entityId);
        const retryUrl = new URL(`/vendor/retry-building/${retryToken}`, config.CORS_ORIGIN).toString();
        await this._emailService.sendRejectionEmail(email, reason, retryUrl,"Building Registration");
    }

	private async _handleAmenityRejection(email: string, reason: string): Promise<void> {
        await this._emailService.sendRejectionEmail(email, reason, null, "Amenity Request");
    }
}