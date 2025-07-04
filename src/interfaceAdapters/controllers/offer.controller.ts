import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { CustomRequest } from "../middlewares/auth.middleware";
import { IOfferController } from "../../entities/controllerInterfaces/others/offer-controller.interface";
import { inject, injectable } from "tsyringe";
import { IFetchAllOffersUseCase } from "../../entities/usecaseInterfaces/offer/fetch-all-offers-usecase.interface";
import { CreateOfferSchema } from "../../shared/validations/create-offer.validation";
import { z } from "zod";
import { ICreateOfferUseCase } from "../../entities/usecaseInterfaces/offer/create-offer-usecase.interface";

@injectable()
export class OfferController implements IOfferController{
    constructor(
       @inject("IFetchAllOffersUseCase")
       private _fetchAllOffersUseCase: IFetchAllOffersUseCase,
       @inject("ICreateOfferUseCase")
       private _createOfferUseCase: ICreateOfferUseCase,
    ){}

    async fetchAllOffers(req:Request, res: Response): Promise<void>{
        try {
            const vendorId = (req as CustomRequest).user.userId;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;
            const result = await this._fetchAllOffersUseCase.execute(vendorId, page, limit);
            res.status(StatusCodes.OK).json({
                success: true,
                data: result,
            })
        } catch (error) {
            if (error instanceof Error) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                });
                return 
                }
          console.error("Error fetching space of a building:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed fetching space of a building",
        });
        }
    }
    async createOffer(req:Request, res: Response): Promise<void>{
        try {
            const {title,description,percentage,startDate,endDate,spaceId,buildingId} = req.body;
            const validatedData = CreateOfferSchema.parse({ title, description, percentage, startDate, endDate, spaceId, buildingId })
            const vendorId = (req as CustomRequest).user.userId;

            const response = await this._createOfferUseCase.execute({...validatedData,vendorId})
            if(response.success){
               res.status(StatusCodes.OK).json({
                success:true,
                message: "Offer created successfully."
               })
               return;
            }else{
               res.status(StatusCodes.BAD_REQUEST).json({
                success:false,
                message: "Offer creation Unsuccessfull."
               })
               return;
            }
        } catch (error:any) {
             if (error instanceof z.ZodError) {
                console.log(error)
               res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.errors,
                })
                 return;
            }
              if (error instanceof Error) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                });
                return 
                }
             console.error("Error fetching space of a building:", error);
           res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
           success: false,
           message: "Failed fetching space of a building",
        });
        }
    }
    
}