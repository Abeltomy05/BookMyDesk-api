import { inject, injectable } from "tsyringe";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IBuildingRepository } from "../../entities/repositoryInterfaces/building/building-repository.interface";
import { IGetVendorsAndBuildingsUseCase } from "../../entities/usecaseInterfaces/users/get-vendorAndBuilding-usecase.interface";

@injectable()
export class GetVendorsAndBuildingsUseCase implements IGetVendorsAndBuildingsUseCase{
  constructor(
    @inject("IVendorRepository") private _vendorRepo: IVendorRepository,
    @inject("IBuildingRepository") private _buildingRepo: IBuildingRepository,
  ) {}

  async execute(): Promise<{
    vendors: { names: { _id: string; companyName: string }[]; count: number };
    buildings: { names: { _id: string; buildingName: string }[]; count: number };
  }> {
    const [vendorResult, buildingResult] = await Promise.all([
      this._vendorRepo.getNamesAndCount(),
      this._buildingRepo.getNamesAndCount(),
    ]);

    return {
      vendors: vendorResult,
      buildings: buildingResult,
    };
  }
}