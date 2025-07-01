import { inject, injectable } from "tsyringe";
import { IStripeService } from "../../entities/serviceInterfaces/stripe-service.interface";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/wallet-repository.interface";
import { IWalletTransactionRepository } from "../../entities/repositoryInterfaces/wallet/walletTrasaction-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IConfirmTopupPaymentUseCase } from "../../entities/usecaseInterfaces/wallet/confirm-topup-payment-usecase.interface";

@injectable()
export class ConfirmTopupPaymentUseCase implements IConfirmTopupPaymentUseCase{
    constructor(
      @inject("IStripeService") private _stripeService: IStripeService,
      @inject("IWalletRepository") private _walletRepository: IWalletRepository,
      @inject("IWalletTransactionRepository") private _walletTransactionRepository: IWalletTransactionRepository,
      @inject("IVendorRepository") private _vendorRepository: IVendorRepository,
      @inject("IClientRepository") private _clientRepository: IClientRepository,
    ){}

    async execute(paymentIntentId:string):Promise<{ success: boolean; data?:{walletBalance:number};}>{
       const capturedIntent = await this._stripeService.capturePaymentIntent(paymentIntentId);
       if (capturedIntent.status !== "succeeded") {
        throw new Error("Payment capture failed");
       }

       const amountInRupees = capturedIntent.amount / 100;

       const metadata = capturedIntent.metadata;
       const username = metadata.username;
       const userId = metadata.userId;
       const role = metadata.role;
       const email = metadata.email;

        if (!userId || !username || !email || !role) {
         throw new Error("Missing metadata. Please contact support.");
        }

         let wallet;
            if (role === "client") {
            const client = await this._clientRepository.findOne({ _id: userId });
            if (!client) throw new Error("Client not found");
            wallet = await this._walletRepository.findOne({userId: client._id});
            } else if (role === "vendor") {
            const vendor = await this._vendorRepository.findOne({ _id: userId });
            if (!vendor) throw new Error("Vendor not found");
            wallet = await this._walletRepository.findOne({userId: vendor._id});
            } else {
            throw new Error("Invalid role in metadata");
          }

           if (!wallet) throw new Error("Wallet not found");
             
            const oldBalance = wallet.balance;
            const newBalance = wallet.balance + amountInRupees;
            await this._walletRepository.update({_id:wallet._id},{balance:newBalance});

             await this._walletTransactionRepository.save({
                walletId: wallet._id,
                amount: amountInRupees,
                type: "topup",
                description: `Topuped ${amountInRupees} via stripe.`,
                balanceBefore: oldBalance,
                balanceAfter: newBalance,
             });

             return {
                success: true,
                data: {
                    walletBalance: newBalance,
                },
              };
    }
}