import { Request, Response } from "express";
import { IBookingController } from "../../entities/controllerInterfaces/others/booking-controller.interface";
import { inject, injectable } from "tsyringe";
import { IGetBookingPageDataUseCase } from "../../entities/usecaseInterfaces/booking/booking-page-data-usecase.interface";
import { CustomRequest } from "../middlewares/auth.middleware";
import { ICreatePaymentIntentUseCase } from "../../entities/usecaseInterfaces/booking/create-payment-intent-usecase.interface";
import { IConfirmPaymentUseCase } from "../../entities/usecaseInterfaces/booking/confirm-payment-usecase.interface";
import { IGetBookingsUseCase } from "../../entities/usecaseInterfaces/booking/get-booking-usecase.interface";

@injectable()
export class BookingController implements IBookingController{
    constructor(
       @inject("IGetBookingPageDataUseCase")
       private _getBookingPageData:IGetBookingPageDataUseCase,
       @inject("ICreatePaymentIntentUseCase")
       private _createPaymentIntentUseCase: ICreatePaymentIntentUseCase,
       @inject("IConfirmPaymentUseCase")
       private _confirmPaymentUseCase: IConfirmPaymentUseCase,
       @inject("IGetBookingsUseCase")
       private _getBookings: IGetBookingsUseCase
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

    async createPaymentIntent(req: Request, res: Response): Promise<void> {
        try {
            const { amount, currency = "inr", spaceId, bookingDate, numberOfDesks  } = req.body;
            if (!amount || !spaceId || !bookingDate) {
              res.status(400).json({ 
                error: 'Missing required fields' 
              });
              return;
            }

            const clientId = (req as CustomRequest).user.userId;
            const result  = await this._createPaymentIntentUseCase.execute({
                amount: Math.round(amount * 100), // Convert to cents
                currency,
                spaceId,
                bookingDate,
                numberOfDesks,
                clientId
            });
            res.status(200).json({
                success: true,
                data:result,
                message: "Payment intent created successfully."
            });
        } catch (error: any) {
            console.error("Error creating payment intent:", error);
            res.status(500).json({
                success: false,
                message: error.message || "Something went wrong while creating payment intent.",
            });
        }
    }

    async confirmPayment(req: Request, res: Response): Promise<void> {
      try {
        const { paymentIntentId } = req.body;
        if (!paymentIntentId) {
          res.status(400).json({ 
            success: false,
            message: 'Missing required fields: paymentIntentId' 
          });
          return;
        }

        const result = await this._confirmPaymentUseCase.execute({
          paymentIntentId,
        }); 

        if (result.success) {
          res.status(200).json({
            success: true,
            data:result.data,
            message: "Payment confirmed successfully.",
          });
        } else {
          res.status(400).json(result);
        }
      } catch (error:any) {
        console.error("Error confirming payment:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while confirming payment.",
        });
      }
    }

    async getBookings(req: Request, res: Response): Promise<void> {
        try {
            const { page = '1', limit = '5', search = '', status } = req.query;
            const {userId,role} = (req as CustomRequest).user;
 
            const pageNum = parseInt(page as string, 10);
            const limitNum = parseInt(limit as string, 10);
            const searchStr = search as string;
            const statusStr = status as string;

            const result  = await this._getBookings.execute({
              userId,
              role,
              page: pageNum,
              limit: limitNum,
              search: searchStr,
              status: statusStr
            });

            res.status(200).json({
                success: true,
                data: result.bookings,
                currentPage: pageNum,
                totalPages: result.totalPages,
                totalItems: result.totalItems,
                message: "Bookings fetched successfully."
            });
        } catch (error:any) {
            console.error("Error fetching bookings:", error);
            res.status(500).json({
                success: false,
                message: error.message || "Something went wrong while fetching bookings.",
            });
        }
    }
}