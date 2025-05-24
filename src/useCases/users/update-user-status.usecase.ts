import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IUpdateUserStatusUseCase } from "../../entities/usecaseInterfaces/users/update-user-status-usecase.interface";
import { Types } from "mongoose";

@injectable()
export class UpdateUserStatusUseCase implements IUpdateUserStatusUseCase {
	constructor(
		@inject("IClientRepository")
		private _clientRepository: IClientRepository,
		@inject("IVendorRepository")
		private _vendorRepository: IVendorRepository
	) {}
	async execute(userType: string, userId: any, status: string): Promise<void> {
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

		await repo.update(
        { _id: userId },
        { status }
        );
	}
}