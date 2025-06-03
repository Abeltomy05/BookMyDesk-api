import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IGetAllUsersUseCase } from "../../entities/usecaseInterfaces/users/get-all-users-usecase.interface";
import { IUsersController } from "../../entities/controllerInterfaces/users/users-controller.interface";
import { StatusCodes } from "http-status-codes";
import { IUpdateUserStatusUseCase } from "../../entities/usecaseInterfaces/users/update-user-status-usecase.interface";
import { IGetUserCountUseCase } from "../../entities/usecaseInterfaces/users/get-user-count-usecase.interface";
import { CustomRequest } from "../middlewares/auth.middleware";
import { IUpdateUserProfileUseCase } from "../../entities/usecaseInterfaces/users/update-user-profile.interface";
import { IUpdateUserPasswordUseCase } from "../../entities/usecaseInterfaces/users/update-password.interface";
import { IGetUserDataUseCase } from "../../entities/usecaseInterfaces/users/get-user-data-usecase.interface";
import { userSchemas } from "./auth/validations/user-signup.validation.schema";

@injectable()
export class UsersController implements IUsersController{
    constructor(
       @inject("IGetAllUsersUseCase")
       private _getAllUsersUseCase: IGetAllUsersUseCase,
       @inject("IUpdateUserStatusUseCase") 
       private _updateUserStatusUseCase: IUpdateUserStatusUseCase,
       @inject("IGetUserCountUseCase")
       private _getUserCountUseCase: IGetUserCountUseCase,
       @inject("IUpdateUserProfileUseCase")
       private _updateUserProfileUseCase: IUpdateUserProfileUseCase,
       @inject("IUpdateUserPasswordUseCase")
       private _updateUserPasswordUseCase: IUpdateUserPasswordUseCase,
       @inject("IGetUserDataUseCase")
       private _getUserDataUseCase: IGetUserDataUseCase,
    ){}

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
           const { page = 1, limit = 10, search = "", role, excludeStatus  } = req.query; 
           console.log("Fetching all users with params:", { page, limit, search, role, excludeStatus });
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
            excludeStatusArr
		   );

    
           res.status(200).json({
			success: true,
			users,
			totalPages,
			currentPage: pageNumber,
		 });
        } catch (error) {
             console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users. Please try again later.",
            error: error instanceof Error ? error.message : String(error),
        });
        }
    }

    async getUserData(req: Request, res: Response): Promise<void> {
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
            console.error("Error fetching user data:", error);
            res.status(500).json({ 
                success: false, 
                message: "Failed to fetch user data" 
            });
        }
    }

    async updateUserStatus(req: Request, res: Response): Promise<void> {
        try {
            const { userType, userId, status, reason } = req.body;
            console.log("Updating user status:", { userType, userId, status });
            await this._updateUserStatusUseCase.execute(userType, userId, status, reason);

            res.status(StatusCodes.OK).json({ 
                success: true,
                message: "User status updated successfully" 
            });
        } catch (error) {
            console.error("Error updating user status:", error);
            res.status(500).json({ success: false, message: "Failed to update user status" });
        }
    }

   async getUserCount(req: Request, res: Response): Promise<void> {
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
    }catch(error:any){
        console.error("Error fetching user count:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch user count",
        });
    }
   }

   async updateUserProfile(req: Request, res: Response): Promise<void> {
     try {
         const {userId,role} = (req as CustomRequest).user; 
         const data = req.body;
 
         const updatedData  = await this._updateUserProfileUseCase.execute(userId,role, data);
         res.status(StatusCodes.OK).json({
            success: true,
            message: "User profile updated successfully",
            data: updatedData,
         })
     } catch (error: any) {
        console.error("Error updating user profile:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update user profile",
        });
        
     }
   }

   async updateUserPassword(req: Request, res: Response): Promise<void> {
    try {
        const { userId, role } = (req as CustomRequest).user;
        const { currentPassword, newPassword } = req.body;

        const response = await this._updateUserPasswordUseCase.execute(userId, role, currentPassword, newPassword);
        res.status(StatusCodes.OK).json({
            success: true,
            message: "User password updated successfully",
            data: response,
        })
    } catch (error: any) {
        console.error("Error updating user password:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update user password",
        });
    }
   }
}