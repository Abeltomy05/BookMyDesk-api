import { Request, Response } from "express";
import { CustomRequest } from "../middlewares/auth.middleware";
import { IWalletController } from "../../entities/controllerInterfaces/others/wallet-controller.interface";
import { inject, injectable } from "tsyringe";
import { IGetWalletDetailsUseCase } from "../../entities/usecaseInterfaces/wallet/get-walletDetails-usecase.interface";
import { IPayWithWalletUseCase } from "../../entities/usecaseInterfaces/wallet/pay-with-wallet-usecase.interface";
import { StatusCodes } from "http-status-codes";

@injectable()
export class WalletController implements IWalletController {
  constructor(
     @inject("IGetWalletDetailsUseCase")
     private _getWalletDetailsUseCase: IGetWalletDetailsUseCase,
     @inject("IPayWithWalletUseCase")
     private _payWithWalletUseCase: IPayWithWalletUseCase,  
  ) {}

    async getWalletDetails(req: Request, res: Response): Promise<void>{
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;

            const { userId, role } = (req as CustomRequest).user; 
            const roleToSend = role === "vendor" ? "Vendor" : role === "client" ? "Client" : "Admin";

            const walletDetails = await this._getWalletDetailsUseCase.execute(userId, roleToSend, page, limit);

            res.status(StatusCodes.OK).json({
                success: true,
                message: "Wallet details retrieved successfully",
                data: walletDetails,
            });
        } catch (error:any) {
            console.error("Error getting wallet details:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || "Failed to get wallet details",
            });
            
        }
    }

    async payWithWallet(req: Request, res: Response): Promise<void>{
        try {
            const {spaceId,bookingDate,numberOfDesks,totalPrice} = req.body;
            if(!spaceId || !bookingDate || !numberOfDesks || !totalPrice){
                res.status(StatusCodes.BAD_REQUEST).json({
                    success:false,
                    message:"There are missing fields, Please try again."
                })
                return;
            }

            const {userId} = (req as CustomRequest).user;
            const response = await this._payWithWalletUseCase.execute(spaceId,bookingDate,numberOfDesks,totalPrice,userId);
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
        } catch (error:any) {
             console.error("Error during booking with wallet:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || "Failed to book the space with wallet",
            });
        }
    }

}