import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { IUpdateUserPasswordUseCase } from "../../entities/usecaseInterfaces/users/update-password.interface";


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
      throw new Error("Missing required fields.");
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
        throw new Error("Invalid user role.");
    }

    userData = await repository.findOne({ _id: userId });
    if (!userData) {
      throw new Error("User not found.");
    }

     const isPasswordValid = await this._bcrypt.compare(currentPassword, userData.password);
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect.");
    }

    const hashedPassword = await this._bcrypt.hash(newPassword);

     const updatedUser = await repository.update(
      { _id: userId },
      { password: hashedPassword }
    );

     if (!updatedUser) {
    throw new Error("Failed to update user password.");
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