import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IGetAllUsersUseCase } from "../../entities/usecaseInterfaces/users/get-all-users-usecase.interface";
import { IUsersController } from "../../entities/controllerInterfaces/users/users-controller.interface";
import { StatusCodes } from "http-status-codes";
import { IUpdateUserStatusUseCase } from "../../entities/usecaseInterfaces/users/update-user-status-usecase.interface";

@injectable()
export class UsersController implements IUsersController{
    constructor(
       @inject("IGetAllUsersUseCase")
       private _getAllUsersUseCase: IGetAllUsersUseCase,
       @inject("IUpdateUserStatusUseCase") 
       private _updateUserStatusUseCase: IUpdateUserStatusUseCase,
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

           console.log("Fetched users:",  users );
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

    async updateUserStatus(req: Request, res: Response): Promise<void> {
        try {
            const { userType, userId, status } = req.body;
            console.log("Updating user status:", { userType, userId, status });
            await this._updateUserStatusUseCase.execute(userType, userId, status);

            res.status(StatusCodes.OK).json({ 
                success: true,
                message: "User status updated successfully" 
            });
        } catch (error) {
            console.error("Error updating user status:", error);
            res.status(500).json({ success: false, message: "Failed to update user status" });
        }
    }


}