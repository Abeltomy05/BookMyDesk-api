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
         const { role, email, username, googleId, avatar } = data;
        
         const existingClient = await this._clientRepository.findOne({ email });
         const existingVendor = await this._vendorRepository.findOne({ email });

         if (existingClient && role === 'vendor' || existingVendor && role === 'client') {
                throw new Error('This email is already registered.');
            }

         const isClient = role === 'client';
         const repository = isClient ? this._clientRepository : this._vendorRepository;
         const existingUser = isClient ? existingClient : existingVendor;

         if (existingUser) {
          if (!existingUser.googleId) {
            await repository.update({ email }, { googleId });
          }
         return existingUser;
         }

         const userPayload = {
            email,
            username,
            googleId,
            avatar,
            role
            };

     return repository.save(userPayload);
    }
}