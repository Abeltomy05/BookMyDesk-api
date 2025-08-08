import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { IUpdateUserPasswordUseCase } from "../../entities/usecaseInterfaces/users/update-password.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { ERROR_MESSAGES } from "../../shared/constants";


@injectable()
export class UpdateUserPasswordUseCase implements IUpdateUserPasswordUseCase{
    
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,
    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository,
    @inject("IPasswordBcrypt")
    private _bcrypt: IBcrypt
  ) {}

  async execute(userId: string, role:string, currentPassword: string, newPassword: string): Promise<{email: string}> {
    try {
     if (!userId || !currentPassword || !newPassword) {
      throw new CustomError(ERROR_MESSAGES.MISSING_DATA,StatusCodes.BAD_REQUEST);
    }

    let userData: any;
    let repository: IClientRepository | IVendorRepository;

     switch (role) {
      case "vendor":
        repository = this._vendorRepository;
        break;
      case "client":
        repository = this._clientRepository;
        break;
      default:
        throw new CustomError(ERROR_MESSAGES.INVALID_ROLE, StatusCodes.BAD_REQUEST);
    }

    userData = await repository.findOne({ _id: userId });
    if (!userData) {
      throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

     const isPasswordValid = await this._bcrypt.compare(currentPassword, userData.password);
    if (!isPasswordValid) {
      throw new CustomError(ERROR_MESSAGES.INVALID_PASSWORD, StatusCodes.BAD_REQUEST);
    }

    const hashedPassword = await this._bcrypt.hash(newPassword);

     const updatedUser = await repository.update(
      { _id: userId },
      { password: hashedPassword }
    );

     if (!updatedUser) {
    throw new CustomError(ERROR_MESSAGES.FAILED, StatusCodes.INTERNAL_SERVER_ERROR);
     } 

    return {
      email: updatedUser.email,
    };

    } catch (error) {
      console.error("Error updating user password:", error);
      throw error;
    }
  }
}