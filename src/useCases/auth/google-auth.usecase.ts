import { inject, injectable } from "tsyringe";
import { IClientModel } from "../../frameworks/database/mongo/models/client.model";
import { IVendorModel } from "../../frameworks/database/mongo/models/vendor.model";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IGoogleUseCase } from "../../entities/usecaseInterfaces/auth/google-auth-usecase.interface";
import { GoogleAuthDTO } from "../../shared/dtos/user.dto";


@injectable()
export class GoogleUseCase implements IGoogleUseCase{
     constructor(
     @inject("IClientRepository")
     private _clientRepository: IClientRepository,
     @inject("IVendorRepository")
     private _vendorRepository: IVendorRepository,
  ) {}

    async execute(data: GoogleAuthDTO):Promise<Partial<IVendorModel | IClientModel>>{
        const {role,email} = data
        let repository;
        if(role === "client"){
            repository = this._clientRepository; 
        }else if(role === "vendor"){
            repository = this._vendorRepository;
        }else{
            throw new Error("Invalid role");
        }

        const existingUser = await repository.findOne({email});

         if (existingUser) {
            if (!existingUser.googleId) {
            existingUser.googleId = data.googleId;
            await repository.update(email, data.googleId);
            }
            return existingUser;
        }

         const userPayload = {
            email: email,
            username: data.username,
            googleId: data.googleId,
            avatar: data.avatar,
            role: data.role,
            };

     return repository.save(userPayload);
    }
}