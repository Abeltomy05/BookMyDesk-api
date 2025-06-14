import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IGetAllBuildingsUsecase } from "../../entities/usecaseInterfaces/building/get-all-building-usecase.interface";
import { IRegisterBuildingUsecase } from "../../entities/usecaseInterfaces/building/register-building-usecase.interface";
import { IBuildingController } from "../../entities/controllerInterfaces/others/building-controller.interface";
import { StatusCodes } from "http-status-codes";
import { CustomRequest } from "../middlewares/auth.middleware";
import { buildingRegistrationSchema, type BuildingRegistrationData } from "../../shared/validations/register-building.validation";
import { IGetBuildingsForVerification } from "../../entities/usecaseInterfaces/building/get-building-varification-usecase.interface";

@injectable()
export class BuildingController implements IBuildingController{
    constructor(
        @inject("IGetAllBuildingsUsecase")
        private _getAllBuildingsUseCase: IGetAllBuildingsUsecase,
        @inject("IRegisterBuildingUsecase")
        private _registerBuildingUseCase: IRegisterBuildingUsecase,
        @inject("IGetBuildingsForVerification")
        private _getBuildingsForVerification: IGetBuildingsForVerification,
    ){}

   async getAllBuilding(req:Request, res: Response): Promise<void>{
      try {
        const{page=1,limit=5,search='',status} = req.query;
        console.log("Fetching all buildings with params:", { page, limit, search, status });
        const pageNumber = Math.max(Number(page), 1);
        const pageSize = Math.max(Number(limit), 1);
        const vendorId = (req as CustomRequest).user.userId;
        const searchTerm = typeof search === "string" ? search : "";

        const {buildings,totalPages} = await this._getAllBuildingsUseCase.execute(
           vendorId,
			     pageNumber,
			     pageSize,
		       searchTerm,
           status as string,
		   );
      //  console.log("usecase success",buildings)
        res.status(StatusCodes.OK).json({
          success: true,
          buildings,
          totalPages,
          currentPage: pageNumber,
        });
      } catch (error) {
          console.error("Error fetching buildings:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch buildings. Please try again later.",
            error: error instanceof Error ? error.message : String(error),
        });
      }
    }

   async registerBuilding(req:Request, res: Response): Promise<void>{
      try {
        const data = req.body;
        if (!data) {
            res.status(StatusCodes.BAD_REQUEST).json({
              success: false,
              message: "Registration data is required"
            });
            return;
          }

        const validationResult  = buildingRegistrationSchema.safeParse(data);
         if (!validationResult.success) {
          const validationErrors = validationResult.error.errors.map(error => {
            const path = error.path.join('.');
            return path ? `${path}: ${error.message}` : error.message;
          }); 

          res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Validation failed",
            errors: validationErrors
          });
          return;
        } 

        const vendorId = (req as CustomRequest).user.userId; 

        const returnData = await this._registerBuildingUseCase.execute(validationResult.data,vendorId);
        // console.log("usecase success",returnData);
        
        res.status(StatusCodes.OK).json({
          success: true,
          message:"Building registration success",
          data:returnData,
        });
      } catch (error) {
          if (error instanceof Error && error.message.includes("already exists")) {
            res.status(StatusCodes.CONFLICT).json({
              success: false,
              message: error.message,
            });
            return;
          }
           console.error("Error registering building:", error);
        res.status(500).json({
            success: false,
            message: "Failed to register building. Please try again later.",
            error: error instanceof Error ? error.message : String(error),
        });
      }
    }

   async getBuildingsForVerification(req:Request, res: Response): Promise<void>{
    try {
      const {page=1,limit=5} = req.query;
      const pageNumber = Math.max(Number(page), 1);
      const pageSize = Math.max(Number(limit), 1);
      const status = "pending"

      const result  = await this._getBuildingsForVerification.execute(
           pageNumber,
			     pageSize,
           status
          )
       console.log("usecase success",result.buildings)   

      res.status(200).json({
      success: true,
      buildings: result.buildings,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
    });    
    } catch (error) {
       console.error("Error fetching buildings for verification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch buildings for verification.",
    });
    }
   }


}