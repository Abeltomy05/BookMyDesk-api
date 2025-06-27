import { Request, Response } from "express";
import { CustomRequest } from "../middlewares/auth.middleware";
import { IWalletController } from "../../entities/controllerInterfaces/others/wallet-controller.interface";
import { inject, injectable } from "tsyringe";
import { IGetWalletDetailsUseCase } from "../../entities/usecaseInterfaces/wallet/get-walletDetails-usecase.interface";

@injectable()
export class WalletController implements IWalletController {
  constructor(
     @inject("IGetWalletDetailsUseCase")
     private _getWalletDetailsUseCase: IGetWalletDetailsUseCase, 
  ) {}

    async getWalletDetails(req: Request, res: Response): Promise<void>{
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;

            const { userId, role } = (req as CustomRequest).user; 
            const roleToSend = role === "vendor" ? "Vendor" : role === "client" ? "Client" : "Admin";

            const walletDetails = await this._getWalletDetailsUseCase.execute(userId, roleToSend, page, limit);

            res.status(200).json({
                success: true,
                message: "Wallet details retrieved successfully",
                data: walletDetails,
            });
        } catch (error:any) {
            console.error("Error getting wallet details:", error);
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get wallet details",
            });
            
        }
    }

}