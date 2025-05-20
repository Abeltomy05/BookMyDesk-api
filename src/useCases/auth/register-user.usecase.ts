import { inject, injectable } from "tsyringe";
import { IClientEntity } from "../../entities/models/client.entity";
import { IVendorEntity } from "../../entities/models/vendor.entity";
import { IRegisterUserUseCase } from "../../entities/usecaseInterfaces/auth/register-usecase.interface";
import { UserDTO } from "../../shared/dtos/user.dto";
import { IUserExistenceService } from "../../entities/serviceInterfaces/user-existence-service.interface";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";

@injectable()
export class RegisterUserUseCase implements IRegisterUserUseCase {

  constructor(
    @inject("IUserExistenceService")
    private _userExistenceService: IUserExistenceService,
    @inject("IPasswordBcrypt")
    private _passwordBcrypt:IBcrypt,
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,
    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository,
  ){}

  
     async execute(user: UserDTO): Promise<IVendorEntity | IClientEntity | null> {
    const { role, email, password } = user;

    const isEmailExisting = await this._userExistenceService.emailExists(email);
    if (isEmailExisting) {
      throw new Error("Email already exists");
    }

    const hashedPassword = password
      ? await this._passwordBcrypt.hash(password)
      : null;

    let repository;
    if (role === "client") {
      repository = this._clientRepository;
    } else if (role === "vendor") {
      repository = this._vendorRepository;
    } else {
      throw new Error("Invalid role");
    }

    return await repository.save({
      ...user,
      password: hashedPassword ?? "",
    });
  }
}