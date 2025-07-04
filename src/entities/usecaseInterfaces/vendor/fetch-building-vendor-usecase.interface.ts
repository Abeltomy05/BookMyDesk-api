import { IBuildingShort } from "../../../useCases/vendor/fetch-buildings-vendor.usecase";

export interface IFetchBuildingsForVendorUseCase{
    execute(vendorId: string):Promise<IBuildingShort[]>
}