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
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../shared/constants";

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

            const walletDetails = await this._getWalletDetailsUseCase.execute(userId, roleToSend, page, limit);
         
            res.status(StatusCodes.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.WALLET_DETAILS_RETRIEVED,
                data: walletDetails,
            });
        } catch (error) {
            next(error)
            
        }
    }

    async payWithWallet(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const {spaceId,bookingDates,numberOfDesks,totalPrice,discountAmount} = req.body;
            if(!spaceId || !bookingDates || !numberOfDesks || !totalPrice){
                res.status(StatusCodes.BAD_REQUEST).json({
                    success:false,
                    message:ERROR_MESSAGES.MISSING_DATA
                })
                return;
            }

            const {userId} = (req as CustomRequest).user;
            const response = await this._payWithWalletUseCase.execute(spaceId,bookingDates,numberOfDesks,totalPrice,userId,discountAmount);
            if(response.success && response.bookingId){
                res.status(StatusCodes.OK).json({
                    success: true,
                    message: SUCCESS_MESSAGES.BOOKING_CONFIRMED,
                    data: response.bookingId
                });
            }else{
                 res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: ERROR_MESSAGES.FAILED,
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
                message: ERROR_MESSAGES.MISSING_CREDENTIALS
            }); 
            }
            const {userId,role} = (req as CustomRequest).user;
            const response = await this._createTopupPaymentIntentUseCase.execute(amount,currency,userId,role);
            res.status(StatusCodes.OK).json({
                success: true,
                data: response,
                message: SUCCESS_MESSAGES.CREATED
            });
        } catch (error) {
          next(error)
        }
    }

    async confirmTopupPayment(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const { paymentIntentId } = req.body;
            if (!paymentIntentId) {
            res.status(StatusCodes.BAD_REQUEST).json({ 
                success: false,
                message: ERROR_MESSAGES.MISSING_CREDENTIALS 
            });
            return;
            }

            const result = await this._confirmTopupPaymentUseCase.execute(paymentIntentId); 

            if (result.success) {
            res.status(StatusCodes.OK).json({
                success: true,
                data:result.data,
                message: SUCCESS_MESSAGES.PAYMENT_CONFIRMED,
            });
            } else {
            res.status(StatusCodes.BAD_REQUEST).json(result);
            }
        } catch (error) {
           next(error)
        }
    }

}