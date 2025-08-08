import { inject, injectable } from "tsyringe";
import { IStripeService } from "../../entities/serviceInterfaces/stripe-service.interface";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/wallet-repository.interface";
import { IWalletTransactionRepository } from "../../entities/repositoryInterfaces/wallet/walletTrasaction-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IConfirmTopupPaymentUseCase } from "../../entities/usecaseInterfaces/wallet/confirm-topup-payment-usecase.interface";
import { Types } from "mongoose";
import { CustomError } from "../../entities/utils/custom.error";
import { StatusCodes } from "http-status-codes";
import { ERROR_MESSAGES } from "../../shared/constants";

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
        throw new CustomError(ERROR_MESSAGES.FAILED,StatusCodes.BAD_REQUEST);
       }

       const amountInRupees = capturedIntent.amount / 100;

       const metadata = capturedIntent.metadata;
       const username = metadata.username;
       const userId = metadata.userId;
       const role = metadata.role;
       const email = metadata.email;

        if (!userId || !username || !email || !role) {
         throw new CustomError(ERROR_MESSAGES.MISSING_DATA, StatusCodes.BAD_REQUEST);
        }

            if (role === "client") {
            const client = await this._clientRepository.findOne({ _id: userId });
            if (!client) throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND);

            } else if (role === "vendor") {
            const vendor = await this._vendorRepository.findOne({ _id: userId });
            if (!vendor) throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND);

            } else {
            throw new CustomError(ERROR_MESSAGES.INVALID_ROLE, StatusCodes.BAD_REQUEST);
          }

           const { wallet, balanceBefore, balanceAfter } = await this._walletRepository.updateOrCreateWalletBalance(
               userId,
               role === "vendor" ? "Vendor" : "Client",
               amountInRupees
            );

             await this._walletTransactionRepository.save({
                walletId: new Types.ObjectId(wallet._id),
                amount: amountInRupees,
                type: "topup",
                description: `Topuped ${amountInRupees} via stripe.`,
                balanceBefore,
                balanceAfter,
             });

             return {
                success: true,
                data: {
                    walletBalance: balanceAfter,
                },
              };
    }
}