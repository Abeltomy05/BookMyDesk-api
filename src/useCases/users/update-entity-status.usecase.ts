import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IUpdateEntityStatusUseCase } from "../../entities/usecaseInterfaces/users/update-user-status-usecase.interface";
import { Types } from "mongoose";
import { IEmailService } from "../../entities/serviceInterfaces/email-service.interface";
import { IJwtService } from "../../entities/serviceInterfaces/jwt-service.interface";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { hasEmail } from "../../shared/helper/hasEmail";
import { config } from "../../shared/config";



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
		@inject("IEmailService")
	    private _emailService: IEmailService, 
		@inject("IJwtService")
	    private _tokenService: IJwtService, 
	) {}
	async execute(entityType: string, entityId: string, status: string, reason?: string): Promise<void> {
		if (!entityType || !entityId || !status) {
			throw new Error("Missing required fields: entityType, entityId, or status");
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

			default:
			throw new Error("Unsupported entity type");
		}
		const entity  = await repo.findOne({ _id: entityId  });

		if (!entity) {
			throw new Error(`${entityType} not found`);
		}

		await repo.update({ _id: entityId },{ status });

		  if (entityType === "vendor" && status === "rejected" && reason && hasEmail(entity)) {
            await this._handleVendorRejection(entity.email, reason);
        }


		 if (entityType === "building" && status === "rejected" && reason && hasEmail(entity)) {
            await this._handleBuildingRejection(entity.email, reason);
        }
	}

	 private async _handleVendorRejection(email: string, reason: string): Promise<void> {
        console.log(`Sending rejection email to vendor: ${email}`);
        const retryToken = this._tokenService.generateResetToken(email);
        const retryUrl = new URL(`/vendor/retry/${retryToken}`, config.CORS_ORIGIN).toString();
        await this._emailService.sendVendorRejectionEmail(email, reason, retryUrl);
    }

	  private async _handleBuildingRejection(email: string, reason: string): Promise<void> {
		 console.log(`Sending rejection email to Building: ${email}`);
        await this._emailService.sendBuildingRejectionEmail(email, reason);
    }
}