import { Request, Response } from "express";
import { IBookingController } from "../../entities/controllerInterfaces/others/booking-controller.interface";
import { inject, injectable } from "tsyringe";
import { IGetBookingPageDataUseCase } from "../../entities/usecaseInterfaces/booking/booking-page-data-usecase.interface";

@injectable()
export class BookingController implements IBookingController{
    constructor(
       @inject("IGetBookingPageDataUseCase")
       private _getBookingPageData:IGetBookingPageDataUseCase
    ){}

    async getBookingPageData(req:Request, res: Response): Promise<void>{
        try {
          const spaceId = req.params.spaceId; 
          if(!spaceId){
            res.status(400).json({
                success:false,
                message:"Space Id is required for getting booking details."
            })
            return;
          }

          const response = await this._getBookingPageData.execute(spaceId);

          res.status(200).json({
            success: true,
            data: response,
          });
        } catch (error:any) {
            console.error("Error fetching booking page data:", error);

             res.status(500).json({
                success: false,
                message: error.message || "Something went wrong while fetching booking data.",
              });
        }

    }
}