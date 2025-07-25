import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IGetAllUsersUseCase } from "../../entities/usecaseInterfaces/users/get-all-users-usecase.interface";
import { IUsersController } from "../../entities/controllerInterfaces/others/users-controller.interface";
import { StatusCodes } from "http-status-codes";
import { IUpdateEntityStatusUseCase } from "../../entities/usecaseInterfaces/users/update-user-status-usecase.interface";
import { IGetUserCountUseCase } from "../../entities/usecaseInterfaces/users/get-user-count-usecase.interface";
import { CustomRequest } from "../middlewares/auth.middleware";
import { IUpdateUserProfileUseCase } from "../../entities/usecaseInterfaces/users/update-user-profile.interface";
import { IUpdateUserPasswordUseCase } from "../../entities/usecaseInterfaces/users/update-password.interface";
import { IGetUserDataUseCase } from "../../entities/usecaseInterfaces/users/get-user-data-usecase.interface";
import { userSchemas } from "./auth/validations/user-signup.validation.schema";
import { IGetVendorsAndBuildingsUseCase } from "../../entities/usecaseInterfaces/users/get-vendorAndBuilding-usecase.interface";
import { IDeleteEntityUseCase } from "../../entities/usecaseInterfaces/users/delete-entity-usecase.interface";
import { getErrorMessage } from "../../shared/error/errorHandler";
import { IMonthlyBookingStats } from "../../entities/usecaseInterfaces/users/get-monthly-booking-stats-usecase.interface";

@injectable()
export class UsersController implements IUsersController{
    constructor(
       @inject("IGetAllUsersUseCase")
       private _getAllUsersUseCase: IGetAllUsersUseCase,
       @inject("IUpdateEntityStatusUseCase") 
       private _updateEnitityStatusUseCase: IUpdateEntityStatusUseCase,
       @inject("IGetUserCountUseCase")
       private _getUserCountUseCase: IGetUserCountUseCase,
       @inject("IUpdateUserProfileUseCase")
       private _updateUserProfileUseCase: IUpdateUserProfileUseCase,
       @inject("IUpdateUserPasswordUseCase")
       private _updateUserPasswordUseCase: IUpdateUserPasswordUseCase,
       @inject("IGetUserDataUseCase")
       private _getUserDataUseCase: IGetUserDataUseCase,
       @inject("IGetVendorsAndBuildingsUseCase")
       private _getVendorsAndBuildingsUseCase: IGetVendorsAndBuildingsUseCase,
       @inject("IDeleteEntityUseCase")
       private _deleteEntityUseCase: IDeleteEntityUseCase,
       @inject("IMonthlyBookingStats")
       private _getMonthlyBookingStats: IMonthlyBookingStats,
    ){}
    
    async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
           const { page = 1, limit = 4, search = "", role, status, excludeStatus  } = req.query; 
           console.log("Fetching all users with params:", { page, limit, search, role, status, excludeStatus });
           const pageNumber = Math.max(Number(page), 1);
           const pageSize = Math.max(Number(limit), 1);
           const searchTerm = typeof search === "string" ? search : "";

            let excludeStatusArr: string[] = [];
            if (typeof excludeStatus === "string") {
            excludeStatusArr = [excludeStatus];
            } else if (Array.isArray(excludeStatus)) {
            excludeStatusArr = excludeStatus.map(String);
            }

           const roleStr = role === "vendor" ? "vendor" : "client";

           const { users, totalPages } = await this._getAllUsersUseCase.execute(
			roleStr,
			pageNumber,
			pageSize,
			searchTerm,
            status as string,
            excludeStatusArr
		   );

           res.status(200).json({
			success: true,
			users,
			totalPages,
			currentPage: pageNumber,
		 });
        } catch (error) {
          next(error)
        }
    }

    async getUserData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, role } = (req as CustomRequest).user;
            console.log("Fetching user data for:", { userId, role });
            const userData = await this._getUserDataUseCase.execute(userId, role);

            res.status(StatusCodes.OK).json({
                success: true,
                message: "User data fetched successfully",
                data: userData,
            });
        } catch (error) {
          next(error)
        }
    }

    async updateEntityStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { entityType, entityId, status, reason } = req.body;
            console.log("Updating user status:", { entityType, entityId, status });
            await this._updateEnitityStatusUseCase.execute(entityType, entityId, status, reason);

            res.status(StatusCodes.OK).json({ 
                success: true,
                message: `${entityType} status updated successfully`
            });
        } catch (error) {
          next(error)
        }
    }

   async getUserCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const {clients, vendors} = await this._getUserCountUseCase.execute();
      console.log("Fetched user counts:", { clients, vendors });
      res.status(StatusCodes.OK).json({
        success: true,
        message: "User count fetched successfully",
        data:{
            clients,
            vendors
        }
      });
    }catch(error){
      next(error)
    }
   }

   async updateUserProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
     try {
         const {userId,role} = (req as CustomRequest).user; 
         const data = req.body;
 
          if (data.location) {
             if (!data.location.name || !data.location.coordinates ||
                !Array.isArray(data.location.coordinates) || 
                data.location.coordinates.length !== 2) {
                res.status(400).json({
                    success: false,
                    message: "Invalid location data format",
                });
                return;
            }

            const [lng, lat] = data.location.coordinates;
            if (typeof lng !== 'number' || typeof lat !== 'number') {
                res.status(400).json({
                    success: false,
                    message: "Invalid coordinates format",
                });
                return;
            }
           }
           
         const updatedData  = await this._updateUserProfileUseCase.execute(userId,role, data);
         res.status(StatusCodes.OK).json({
            success: true,
            message: "User profile updated successfully",
            data: updatedData,
         })
     } catch (error) {
       next(error)
     }
   }

   async updateUserPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { userId, role } = (req as CustomRequest).user;
        const { currentPassword, newPassword } = req.body;

        const response = await this._updateUserPasswordUseCase.execute(userId, role, currentPassword, newPassword);
        res.status(StatusCodes.OK).json({
            success: true,
            message: "User password updated successfully",
            data: response,
        })
    } catch (error) {
     next(error)
    }
   }

  async getVendorsAndBuildings(req: Request, res: Response, next: NextFunction): Promise<void>{
     try {
    const result = await this._getVendorsAndBuildingsUseCase.execute();
    res.status(200).json({ success: true, data: result });
   } catch (error) {
   next(error)
   }
  }

  async deleteEntity(req:Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const entityId = req.query.entityId as string;
            const entityType = req.query.entityType as string;
            
            const response = await this._deleteEntityUseCase.execute( entityId, entityType );
            if(response.success){
                res.status(StatusCodes.OK).json({
                    success:true,
                    message: `${entityType} deleted successfully`,
                })
                return;
            }else{
                 res.status(StatusCodes.BAD_REQUEST).json({
                    success:true,
                    message: `${entityType} deletion not successful. Please try again.`,
                })
                return;
            }
        } catch (error) {
          next(error)
        }
    }

  async getMonthlyBookingStats(req:Request, res: Response, next: NextFunction): Promise<void>{
    try {
        const result = await this._getMonthlyBookingStats.execute()
        res.status(StatusCodes.OK).json({
            success: true,
            data: result,
        })
    } catch (error) {
      next(error)
    }
  }

}