import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IVendorModel } from "../../frameworks/database/mongo/models/vendor.model";
import { IClientModel } from "../../frameworks/database/mongo/models/client.model";
import { IGetUserDataUseCase } from "../../entities/usecaseInterfaces/users/get-user-data-usecase.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { ERROR_MESSAGES } from "../../shared/constants";

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
                throw new CustomError(ERROR_MESSAGES.INVALID_ROLE,StatusCodes.BAD_REQUEST);
           }

           const user = await repo.findOne({_id:userId});
              if (!user) {
                 throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
              }

              const { password, ...userData } = user;
              return userData as Omit<IClientModel, 'password'> | Omit<IVendorModel, 'password'>;
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error;
        }
    }
}