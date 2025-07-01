import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IVendorController } from "../../entities/controllerInterfaces/others/vendor-controller.interface";
import { StatusCodes } from "http-status-codes";
import { CustomRequest } from "../middlewares/auth.middleware";
import { IUploadIdProofUseCase } from "../../entities/usecaseInterfaces/vendor/uploadIdProof-usecase.interface";
import { IGetRetryDataUseCase } from "../../entities/usecaseInterfaces/vendor/get-retry-data.interface";
import { IRetryRegistration } from "../../entities/usecaseInterfaces/vendor/retry-registration.interface";
import { IGetVendorHomeData } from "../../entities/usecaseInterfaces/vendor/get-vendor-home-data-usecase.interface";

@injectable()
export class VendorController implements IVendorController{
    constructor(
        @inject("IUploadIdProofUseCase")
        private _uploadIdProofUseCase: IUploadIdProofUseCase,
        @inject("IGetRetryDataUseCase")
        private _getRetryDataUseCase: IGetRetryDataUseCase,
        @inject("IRetryRegistration")
        private _retryRegistration: IRetryRegistration,
        @inject("IGetVendorHomeData")
        private _getVendorHomeDataUseCase: IGetVendorHomeData,
    ){}

    async uploadIdProof(req: Request, res: Response): Promise<void> {
      try {
        const { idProof } = req.body;
        if (!idProof) {
          res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "ID proof is required" });
          return;
        }
        const vendorId = (req as CustomRequest).user.userId; 
        const vendor = await this._uploadIdProofUseCase.uploadIdProof(vendorId, idProof);

        let accessTokenName = 'vendor_access_token';
        let refreshTokenName = 'vendor_refresh_token';
        
        res.clearCookie(accessTokenName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/", 
        });

        res.clearCookie(refreshTokenName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        });


        res.status(StatusCodes.OK).json({
        success: true,
        message: "ID proof uploaded successfully",
        data: vendor,
        });
      } catch (error) {
          console.error("Error uploading ID proof:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to upload ID proof",
        });
      }
    }

    async getRetryData(req: Request, res: Response): Promise<void>{
      try {
         const {token} = req.query;
          if (!token || typeof token !== 'string') {
            res.status(400).json({ success: false, message: "Token is required" })
            return
          }

         const vendor = await this._getRetryDataUseCase.execute(token);
         
          res.status(StatusCodes.OK).json({
             success: true,
             data: vendor,
          })
      } catch (error) {
         console.error("Error getting retry data:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to get retry data",
        });
      }
    }

    async retryRegistration(req: Request, res: Response): Promise<void>{
      try {
        const {email,phone,companyName,companyAddress,idProof} = req.body;
        if(!phone || !companyName || !companyAddress || !idProof){
            res.status(400).json({ success: false, message: "All credentials required" })
            return
        }

        await this._retryRegistration.execute({email,phone,companyName,companyAddress,idProof});
        res.status(StatusCodes.OK).json({
          success: true,
          message: "Your application has been retried with the updated details. Please wait while the admin reviews and approves it.",
        });
      } catch (error) {
           console.error("Error retry vendor registration:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed in retry vendor registration",
        });
      }
    }

    async vendorHomeData(req: Request, res: Response): Promise<void>{
      try {
        const vendorId = (req as CustomRequest).user.userId;

        const response = await this._getVendorHomeDataUseCase.execute(vendorId);
         res.status(200).json({
          success: true,
          data: response,
        });
      } catch (error) {
        console.error("Error retry vendor registration:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed in retry vendor registration",
        });
      }
    }


}