import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IUpdateUserStatusUseCase } from "../../entities/usecaseInterfaces/users/update-user-status-usecase.interface";
import { Types } from "mongoose";
import { IEmailService } from "../../entities/serviceInterfaces/email-service.interface";
import { IJwtService } from "../../entities/serviceInterfaces/jwt-service.interface";

@injectable()
export class UpdateUserStatusUseCase implements IUpdateUserStatusUseCase {
	constructor(
		@inject("IClientRepository")
		private _clientRepository: IClientRepository,
		@inject("IVendorRepository")
		private _vendorRepository: IVendorRepository,
		@inject("IEmailService")
	    private _emailService: IEmailService, 
		@inject("IJwtService")
	    private _tokenService: IJwtService, 
	) {}
	async execute(userType: string, userId: any, status: string, reason?: string): Promise<void> {
		let repo;

		if (userType === "client") {
			repo = this._clientRepository;
		} else if (userType === "vendor") {
			repo = this._vendorRepository;
		} else {
			throw new Error("Invalid user type");
		}
		const user = await repo.findOne({ _id: userId });

		if (!user) {
			throw new Error("User not found");
		}

		await repo.update({ _id: userId },{ status });

		 if (userType === "vendor" && status === "rejected" && reason) {
			console.log(`Sending rejection email to vendor: ${user.email}`);

			const retryToken = this._tokenService.generateResetToken(user.email);
			const retryUrl = new URL(`/vendor/retry/${retryToken}`, process.env.CORS_ORIGIN).toString();

            await this._emailService.sendVendorRejectionEmail(user.email, reason, retryUrl);
        }
	}
}