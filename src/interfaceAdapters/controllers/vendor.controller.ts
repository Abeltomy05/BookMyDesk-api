import { NextFunction, Request, Response } from "express";
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
import { config } from "../../shared/config";
import { ERROR_MESSAGES, INFO_MESSAGES, SUCCESS_MESSAGES } from "../../shared/constants";

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

    async uploadIdProof(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const { idProof } = req.body;
        if (!idProof) {
          res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.ID_PROOF_REQUIRED });
          return;
        }
        const vendorId = (req as CustomRequest).user.userId; 
        const vendor = await this._uploadIdProofUseCase.uploadIdProof(vendorId, idProof);

        let accessTokenName = 'vendor_access_token';
        let refreshTokenName = 'vendor_refresh_token';
        
        res.clearCookie(accessTokenName, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "strict",
        path: "/", 
        });

        res.clearCookie(refreshTokenName, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        });


        res.status(StatusCodes.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.ID_PROOF_UPLOADED,
        data: vendor,
        });
      } catch (error) {
        next(error);
      }
    }

    async getRetryData(req: Request, res: Response, next: NextFunction): Promise<void>{
      try {
         const {token} = req.query;
          if (!token || typeof token !== 'string') {
            res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Token is required" })
            return
          }

         const vendor = await this._getRetryDataUseCase.execute(token);
         
          res.status(StatusCodes.OK).json({
             success: true,
             data: vendor,
          })
      } catch (error) {
       next(error)
      }
    }

    async retryRegistration(req: Request, res: Response, next: NextFunction): Promise<void>{
      try {
        const {email,phone,companyName,companyAddress,idProof} = req.body;
        if(!phone || !companyName || !companyAddress || !idProof){
            res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "All credentials required" })
            return
        }

        await this._retryRegistration.execute({email,phone,companyName,companyAddress,idProof});
        res.status(StatusCodes.OK).json({
          success: true,
          message: INFO_MESSAGES.APPLICATION_RETRIED,
        });
      } catch (error) {
         next(error)
      }
    }

    async vendorHomeData(req: Request, res: Response, next: NextFunction): Promise<void>{
      try {
        const vendorId = (req as CustomRequest).user.userId;

        const response = await this._getVendorHomeDataUseCase.execute(vendorId);
         res.status(StatusCodes.OK).json({
          success: true,
          data: response,
        });
      } catch (error) {
       next(error)
      }
    }

    async singleVendorData(req: Request, res: Response, next: NextFunction): Promise<void>{
      try {
        const vendorId = req.params.vendorId;

        const result = await this._getsingleVendorDataUseCase.execute(vendorId);

        res.status(StatusCodes.OK).json({
          success:true,
          data:result,
        })
      } catch (error) {
       next(error)
      }
    }

    async fetchBuildingsForVendor(req: Request, res: Response, next: NextFunction): Promise<void>{
      try {
        const vendorId = (req as CustomRequest).user.userId;
        const result = await this._fetchBuildingsForVendorUseCase.execute(vendorId);
        res.status(StatusCodes.OK).json({
          success: true,
          data: result,
        })
      } catch (error) {
        next(error)
      }
    }

    async fetchSpaceForBuilding(req: Request, res: Response, next: NextFunction): Promise<void>{
      try {
        const buildingId = req.params.buildingId;
        const response = await this._fetchSpacesForBuildingUseCase.execute(buildingId);
        res.status(StatusCodes.OK).json({
          success: true,
          data: response,
        })
      } catch (error) {
       next(error)
      }
    }


}