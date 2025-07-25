import { inject, injectable } from "tsyringe";
import { IStripeService } from "../../entities/serviceInterfaces/stripe-service.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { CreatePaymentIntentResponse } from "../../shared/dtos/booking.dto";
import { ICreateTopUpPaymentIntentUseCase } from "../../entities/usecaseInterfaces/wallet/create-topup-payment-intent-usecase.interface";
import { config } from "../../shared/config";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";


@injectable()
export class CreateTopUpPaymentIntentUseCase implements ICreateTopUpPaymentIntentUseCase{
    constructor(
      @inject("IStripeService")
      private _stripeService: IStripeService,
      @inject("IClientRepository") 
      private _clientRepository: IClientRepository,
      @inject("IVendorRepository") 
      private _vendorRepository: IVendorRepository,
    ){}

    async execute(amount:number,currency:string,userId:string,role:string):Promise<CreatePaymentIntentResponse>{
        let repo: IClientRepository | IVendorRepository;
        if(role === 'client') repo = this._clientRepository;
        else if(role === 'vendor') repo = this._vendorRepository;
        else throw new CustomError("Invalid role",StatusCodes.BAD_REQUEST);

        const user = await repo.findOne({_id:userId});
        if(!user) throw new CustomError("User Not Found.", StatusCodes.NOT_FOUND);

         const paymentIntent = await this._stripeService.createPaymentIntent({
                amount: Math.round(amount * 100), 
                currency,
                capture_method: 'manual', 
                metadata: {
                    purpose: 'wallet-topup',
                    role,
                    userId,
                    username: user.username,
                    email: user.email,
                },
         });

          return {
            clientSecret: paymentIntent.client_secret!,
            paymentIntentId: paymentIntent.id,
            publishableKey: config.STRIPE_PUBLIC_KEY!,
          };
    }
}