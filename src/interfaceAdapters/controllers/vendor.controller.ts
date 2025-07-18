import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IVendorController } from "../../entities/controllerInterfaces/others/vendor-controller.interface";
import { StatusCodes } from "http-status-codes";
import { CustomRequest } from "../middlewares/auth.middleware";
import { IUploadIdProofUseCase } from "../../entities/usecaseInterfaces/vendor/uploadIdProof-usecase.interface";
import { IGetRetryDataUseCase } from "../../entities/usecaseInterfaces/vendor/get-retry-data.interface";
import { IRetryRegistration } from "../../entities/usecaseInterfaces/vendor/retry-registration.interface";
import { IGetVendorHomeData } from "../../entities/usecaseInterfaces/vendor/get-vendor-home-data-usecase.interface";
import { IGetSingleVendorData } from "../../entities/usecaseInterfaces/vendor/get-single-vendorData-usecase.interface";
import { IFetchBuildingsForVendorUseCase } from "../../entities/usecaseInterfaces/vendor/fetch-building-vendor-usecase.interface";
import { IFetchSpacesForBuilding } from "../../entities/usecaseInterfaces/vendor/fetch-space-building-usecase.interface";
import { getErrorMessage } from "../../shared/error/errorHandler";

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
        @inject("IGetSingleVendorData")
        private _getsingleVendorDataUseCase: IGetSingleVendorData,
        @inject("IFetchBuildingsForVendorUseCase")
        private _fetchBuildingsForVendorUseCase: IFetchBuildingsForVendorUseCase,
        @inject("IFetchSpacesForBuilding")
        private _fetchSpacesForBuildingUseCase: IFetchSpacesForBuilding,
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
      } catch (error:unknown) {
         const message = getErrorMessage(error);
        console.error("Error uploading ID proof:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message,
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
      } catch (error:unknown) {
         const message = getErrorMessage(error);
         console.error("Error getting retry data:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message,
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
      } catch (error:unknown) {
         const message = getErrorMessage(error);
           console.error("Error retry vendor registration:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message,
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
      } catch (error:unknown) {
         const message = getErrorMessage(error);
        console.error("Error retry vendor registration:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message,
        });
      }
    }

    async singleVendorData(req: Request, res: Response): Promise<void>{
      try {
        const vendorId = req.params.vendorId;
        console.log("VendorId is:",vendorId)
        const result = await this._getsingleVendorDataUseCase.execute(vendorId);
        console.log("vendor Data",result);
        res.status(StatusCodes.OK).json({
          success:true,
          data:result,
        })
      } catch (error:unknown) {
         const message = getErrorMessage(error);
          console.error("Error getting vendor data in admin side:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message,
        });
      }
    }

    async fetchBuildingsForVendor(req: Request, res: Response): Promise<void>{
      try {
        const vendorId = (req as CustomRequest).user.userId;
        const result = await this._fetchBuildingsForVendorUseCase.execute(vendorId);
        res.status(StatusCodes.OK).json({
          success: true,
          data: result,
        })
      } catch (error:unknown) {
         const message = getErrorMessage(error);
         console.error("Error fetching buildings of a vendor:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message,
        });
      }
    }

    async fetchSpaceForBuilding(req: Request, res: Response): Promise<void>{
      try {
        const buildingId = req.params.buildingId;
        const response = await this._fetchSpacesForBuildingUseCase.execute(buildingId);
        res.status(StatusCodes.OK).json({
          success: true,
          data: response,
        })
      } catch (error:unknown) {
         const message = getErrorMessage(error);
         console.error("Error fetching space of a building:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message,
        });
      }
    }


}