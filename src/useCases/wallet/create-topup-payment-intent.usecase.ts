import { inject, injectable } from "tsyringe";
import { IStripeService } from "../../entities/serviceInterfaces/stripe-service.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { CreatePaymentIntentResponse } from "../../shared/dtos/booking.dto";
import { ICreateTopUpPaymentIntentUseCase } from "../../entities/usecaseInterfaces/wallet/create-topup-payment-intent-usecase.interface";
import { config } from "../../shared/config";


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
        else throw new Error("Invalid role");

        const user = await repo.findOne({_id:userId});
        if(!user) throw new Error("User Not Found.")

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