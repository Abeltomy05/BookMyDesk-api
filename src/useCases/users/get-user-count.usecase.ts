import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IGetUserCountUseCase } from "../../entities/usecaseInterfaces/users/get-user-count-usecase.interface";

@injectable()
export class GetUserCountUseCase implements IGetUserCountUseCase {
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,
    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository
  ) {}

  async execute(): Promise<{ clients: number; vendors: number }> {
    try {
      const clients = await this._clientRepository.countDocuments();
      const vendors = await this._vendorRepository.countDocuments();
      return {
        clients,
        vendors,
      };
    } catch (error) {
      console.error("Error fetching user count:", error);
      throw new Error("Failed to fetch user count. Please try again later.");
    }
  }
}
