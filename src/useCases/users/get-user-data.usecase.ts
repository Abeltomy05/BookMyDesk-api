import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IVendorModel } from "../../frameworks/database/mongo/models/vendor.model";
import { IClientModel } from "../../frameworks/database/mongo/models/client.model";
import { IGetUserDataUseCase } from "../../entities/usecaseInterfaces/users/get-user-data-usecase.interface";

@injectable()
export class GetUserDataUseCase implements IGetUserDataUseCase {
    constructor(
        @inject("IClientRepository")
        private _userRepository: IClientRepository,
        @inject("IVendorRepository")
        private _vendorRepository: IVendorRepository,
    ) {}

    async execute(userId: string,role: string): Promise<Omit<IClientModel, 'password'> | Omit<IVendorModel, 'password'>> {
        try {
           let repo;
           if(role === "client") {
                repo = this._userRepository;
           }else if(role === "vendor") {
                repo = this._vendorRepository;
           }else{
                throw new Error(`Invalid user role :${role}`);
           }

           const user = await repo.findOne({_id:userId});
              if (!user) {
                 throw new Error("User not found");
              }

              const { password, ...userData } = user;
              return userData as Omit<IClientModel, 'password'> | Omit<IVendorModel, 'password'>;
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error;
        }
    }
}