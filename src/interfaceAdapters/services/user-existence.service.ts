import { inject, injectable } from "tsyringe";
import { IUserExistenceService } from "../../entities/serviceInterfaces/user-existence-service.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IAdminRepository } from "../../entities/repositoryInterfaces/users/admin-repository.interface";


@injectable()
export class UserExistenceService implements IUserExistenceService {
   constructor(
    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository,
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,
    @inject("IAdminRepository")
    private _adminRepository: IAdminRepository,
   ){}

    async emailExists(email: string): Promise<boolean> {
        const [vendor, client, admin] = await Promise.all([
            this._vendorRepository.findOne({ email }),
            this._clientRepository.findOne({ email } ),
            this._adminRepository.findOne({ email } )
        ]);

        return Boolean(vendor || client || admin);
    }
}
