import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { CustomRequest } from "./auth.middleware";
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IBlackListTokenUseCase } from "../../entities/usecaseInterfaces/auth/blacklist-token-usecase.interface";
import { IRevokeRefreshTokenUseCase } from "../../entities/usecaseInterfaces/auth/revoke-refreshtoken-usecase.interface";
import { config } from "../../shared/config";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES } from "../../shared/constants";

@injectable()
export class BlockStatusMiddleware{
    constructor(
     @inject("IClientRepository")
     private _clientRepository: IClientRepository,
     @inject("IVendorRepository")
     private _vendorRepository: IVendorRepository,
     @inject("IBlackListTokenUseCase")
     private _blackListTokenUseCase: IBlackListTokenUseCase,
     @inject("IRevokeRefreshTokenUseCase")
     private _revokeRefreshTokenUseCase: IRevokeRefreshTokenUseCase,
    ){}

    private async getUserStatus(userId:string,role:string){
       let repo;
       if(role === "client"){
        repo = this._clientRepository;
       }else if(role === "vendor"){
        repo = this._vendorRepository;
       }else{
        throw new CustomError(ERROR_MESSAGES.INVALID_ROLE, StatusCodes.BAD_REQUEST);
       }

       const user = await repo.findOne({_id:userId});
       return user?.status;
    }

     checkStatus = async (req: CustomRequest, res: Response, next:NextFunction)=>{
       try {
        if(!req.user){
            res.status(StatusCodes.UNAUTHORIZED) .json({
                success:false,
                message:ERROR_MESSAGES.USER_UNAUTHORIZED
            })
            return;
        }

        const {userId,role,access_token,refresh_token} = req.user;

        if(!["client","vendor"].includes(role)){
            res.status(StatusCodes.BAD_REQUEST).json({
              success:false,
              message:ERROR_MESSAGES.INVALID_ROLE
            })
            return;
        }


        const status = await this.getUserStatus(userId,role);
        if(!status){
            res.status(StatusCodes.NOT_FOUND).json({
                success:false,
                message:ERROR_MESSAGES.USER_NOT_FOUND
            })
            return;
        }

        if(status === "blocked"){
            console.log("Status is Blocked for role:",role)
            await Promise.all([
               this._blackListTokenUseCase.execute(access_token),
               this._revokeRefreshTokenUseCase.execute(refresh_token)
            ]);

		   const accessTokenName = `${role}_access_token`;
		   const refreshTokenName = `${role}_refresh_token`;

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

               res.status(StatusCodes.FORBIDDEN).json({
                success:false,
                message:ERROR_MESSAGES.BLOCKED_USER,
               })

               return;
        }

        next();
       } catch (error) {
        console.error(" Error In Block Status Middleware:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: `${ERROR_MESSAGES.INTERNAL_SERVER_ERROR} while checking blocked status`,
			});
       }
    }
}