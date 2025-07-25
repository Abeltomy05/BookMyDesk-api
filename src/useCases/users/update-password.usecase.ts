import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { IUpdateUserPasswordUseCase } from "../../entities/usecaseInterfaces/users/update-password.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";


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
      throw new CustomError("Missing required fields.",StatusCodes.BAD_REQUEST);
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
        throw new CustomError("Invalid user role.", StatusCodes.BAD_REQUEST);
    }

    userData = await repository.findOne({ _id: userId });
    if (!userData) {
      throw new CustomError("User not found.", StatusCodes.NOT_FOUND);
    }

     const isPasswordValid = await this._bcrypt.compare(currentPassword, userData.password);
    if (!isPasswordValid) {
      throw new CustomError("Current password is incorrect.", StatusCodes.BAD_REQUEST);
    }

    const hashedPassword = await this._bcrypt.hash(newPassword);

     const updatedUser = await repository.update(
      { _id: userId },
      { password: hashedPassword }
    );

     if (!updatedUser) {
    throw new CustomError("Failed to update user password.", StatusCodes.INTERNAL_SERVER_ERROR);
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