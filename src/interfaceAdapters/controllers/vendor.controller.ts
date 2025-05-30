import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IVendorController } from "../../entities/controllerInterfaces/users/vendor-controller.interface";
import { StatusCodes } from "http-status-codes";
import { CustomRequest } from "../middlewares/auth.middleware";
import { IUploadIdProofUseCase } from "../../entities/usecaseInterfaces/vendor/uploadIdProof-usecase.interface";

@injectable()
export class VendorController implements IVendorController{
    constructor(
        @inject("IUploadIdProofUseCase")
        private _uploadIdProofUseCase: IUploadIdProofUseCase
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
}