import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IGetAllBuildingsUsecase } from "../../entities/usecaseInterfaces/building/get-all-building-usecase.interface";
import { IRegisterBuildingUsecase } from "../../entities/usecaseInterfaces/building/register-building-usecase.interface";
import { IBuildingController } from "../../entities/controllerInterfaces/others/building-controller.interface";
import { StatusCodes } from "http-status-codes";
import { CustomRequest } from "../middlewares/auth.middleware";
import { buildingRegistrationSchema, type BuildingRegistrationData } from "../../shared/validations/register-building.validation";
import { IGetBuildingsForVerification } from "../../entities/usecaseInterfaces/building/get-building-varification-usecase.interface";
import { editBuildingValidator } from "./validations/editBuilding.validation";
import { ZodError } from "zod";
import { IEditBuildingUsecase } from "../../entities/usecaseInterfaces/building/edit-building-usecase.interface";
import { IBuildingEntity } from "../../entities/models/building.entity";
import { IGetSingleBuilding } from "../../entities/usecaseInterfaces/building/get-single-building-usecase.interface";
import { IFetchBuildingUseCase } from "../../entities/usecaseInterfaces/building/fetch-building-usecase.interface";

@injectable()
export class BuildingController implements IBuildingController{
    constructor(
        @inject("IGetAllBuildingsUsecase")
        private _getAllBuildingsUseCase: IGetAllBuildingsUsecase,
        @inject("IRegisterBuildingUsecase")
        private _registerBuildingUseCase: IRegisterBuildingUsecase,
        @inject("IGetBuildingsForVerification")
        private _getBuildingsForVerification: IGetBuildingsForVerification,
        @inject("IEditBuildingUsecase")
         private _editBuildingUseCase: IEditBuildingUsecase,
        @inject("IGetSingleBuilding")
        private _getSingleBuildingUseCase: IGetSingleBuilding,
        @inject("IFetchBuildingUseCase")
        private _fetchBuildingUseCase: IFetchBuildingUseCase,
    ){}
//get buildings of a vendor
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
//get buildings with pending status for admin side
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

   async editBuilding(req:Request, res: Response): Promise<void>{
    try {
      const { id, name, email, phone,location, openingHours, description, images, amenities, spaces,} = req.body;
      if(email || phone){
      const parsedData = editBuildingValidator.parse({
            email: email,
            phone: phone,
          });
      }

      const buildingDataToUpdate= { id:id, buildingName: name, email, phone, location, openingHours, description, images, amenities, };
      const spaceList = Array.isArray(spaces) ? spaces : [];
      
      const result = await this._editBuildingUseCase.execute(buildingDataToUpdate,spaceList);
        res.status(200).json({
        success: true,
        message: "Building updated successfully",
        data: result,
      });

    } catch (error) {
       if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors, 
        });
        return
     }
      console.error("Unexpected error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
      return
        }
   }

   async getSingleBuilding(req:Request, res: Response): Promise<void>{
    try {
      const id = req.params.id;
      const buildingWithSpaces  = await this._getSingleBuildingUseCase.execute(id);
      res.status(200).json({ success: true, data: buildingWithSpaces });
    } catch (error) {
        console.error("Error getting building:", error);
       res.status(500).json({ success: false, message: "Error retrieving building" });
    }
   }

   async fetchBuildings(req:Request, res: Response): Promise<void>{
    try {
       const page = parseInt(req.query.page as string) || 1;
       const limit = parseInt(req.query.limit as string) || 5;

       const locationName = req.query.locationName as string;
       const type = req.query.type as string;
       const priceRangeStr = req.query.priceRange as string;

       let minPrice: number | undefined;
       let maxPrice: number | undefined;

        if (priceRangeStr) {
            const decodedPriceRange = decodeURIComponent(priceRangeStr);
            if (decodedPriceRange.endsWith('+')) {
              minPrice = parseInt(decodedPriceRange.replace('+', ''));
              maxPrice = undefined;
            } else if (decodedPriceRange.includes('-')) {
              const [min, max] = decodedPriceRange.split('-').map(Number);
              minPrice = min; 
              maxPrice = max;
            }
          }
        const filters = {
          locationName,
          type,
          minPrice,
          maxPrice,
        };

        console.log('Filters applied:', filters);

      const result = await this._fetchBuildingUseCase.execute(page, limit, filters);
       res.status(200).json({
      success: true,
      data: result.items,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    });
    } catch (error) {
      console.error(error);
       res.status(500).json({ success: false, message: "Failed to fetch buildings" });
    }
   }


}