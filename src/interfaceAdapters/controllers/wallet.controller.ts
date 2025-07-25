import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../middlewares/auth.middleware";
import { IWalletController } from "../../entities/controllerInterfaces/others/wallet-controller.interface";
import { inject, injectable } from "tsyringe";
import { IGetWalletDetailsUseCase } from "../../entities/usecaseInterfaces/wallet/get-walletDetails-usecase.interface";
import { IPayWithWalletUseCase } from "../../entities/usecaseInterfaces/wallet/pay-with-wallet-usecase.interface";
import { StatusCodes } from "http-status-codes";
import { ICreateTopUpPaymentIntentUseCase } from "../../entities/usecaseInterfaces/wallet/create-topup-payment-intent-usecase.interface";
import { IConfirmTopupPaymentUseCase } from "../../entities/usecaseInterfaces/wallet/confirm-topup-payment-usecase.interface";
import { getErrorMessage } from "../../shared/error/errorHandler";

@injectable()
export class WalletController implements IWalletController {
  constructor(
     @inject("IGetWalletDetailsUseCase")
     private _getWalletDetailsUseCase: IGetWalletDetailsUseCase,
     @inject("IPayWithWalletUseCase")
     private _payWithWalletUseCase: IPayWithWalletUseCase,  
     @inject("ICreateTopUpPaymentIntentUseCase")
     private _createTopupPaymentIntentUseCase: ICreateTopUpPaymentIntentUseCase, 
     @inject("IConfirmTopupPaymentUseCase")
     private _confirmTopupPaymentUseCase: IConfirmTopupPaymentUseCase, 
  ) {}

    async getWalletDetails(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;

            const { userId, role } = (req as CustomRequest).user; 
            const roleToSend = role === "vendor" ? "Vendor" : role === "client" ? "Client" : "Admin";
            console.log("Wallet fetch → userId:", userId, "role:", roleToSend);

            const walletDetails = await this._getWalletDetailsUseCase.execute(userId, roleToSend, page, limit);
            console.log(walletDetails)
            res.status(StatusCodes.OK).json({
                success: true,
                message: "Wallet details retrieved successfully",
                data: walletDetails,
            });
        } catch (error) {
            next(error)
            
        }
    }

    async payWithWallet(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const {spaceId,bookingDate,numberOfDesks,totalPrice,discountAmount} = req.body;
            if(!spaceId || !bookingDate || !numberOfDesks || !totalPrice){
                res.status(StatusCodes.BAD_REQUEST).json({
                    success:false,
                    message:"There are missing fields, Please try again."
                })
                return;
            }

            const {userId} = (req as CustomRequest).user;
            const response = await this._payWithWalletUseCase.execute(spaceId,bookingDate,numberOfDesks,totalPrice,userId,discountAmount);
            if(response.success && response.bookingId){
                res.status(StatusCodes.OK).json({
                    success: true,
                    message: "Booking confirmed using wallet",
                    data: response.bookingId
                });
            }else{
                 res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Booking Unsuccessfull, Please try again.",
                });
            }
        } catch (error) {
           next(error)
        }
    }

    async createTopupIntent(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const {amount,currency} = req.body;
            if(!amount || !currency){
               res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Credentials missing for creating topup intent."
            }); 
            }
            const {userId,role} = (req as CustomRequest).user;
            const response = await this._createTopupPaymentIntentUseCase.execute(amount,currency,userId,role);
            res.status(200).json({
                success: true,
                data: response,
                message: "Payment intent created successfully."
            });
        } catch (error) {
          next(error)
        }
    }

    async confirmTopupPayment(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const { paymentIntentId } = req.body;
            if (!paymentIntentId) {
            res.status(400).json({ 
                success: false,
                message: 'Missing required fields: paymentIntentId' 
            });
            return;
            }

            const result = await this._confirmTopupPaymentUseCase.execute(paymentIntentId); 

            if (result.success) {
            res.status(200).json({
                success: true,
                data:result.data,
                message: "Payment confirmed successfully.",
            });
            } else {
            res.status(400).json(result);
            }
        } catch (error) {
           next(error)
        }
    }

}