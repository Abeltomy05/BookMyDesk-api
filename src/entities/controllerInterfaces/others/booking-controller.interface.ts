import { Request, Response } from "express";

export interface IBookingController{
    getBookingPageData(req:Request, res: Response): Promise<void>;
    createPaymentIntent(req: Request, res: Response): Promise<void>;
    confirmPayment(req: Request, res: Response): Promise<void>;
    getBookings(req: Request, res: Response): Promise<void>;
    getBookingDetails(req: Request, res: Response): Promise<void>;
    cancelBooking(req: Request, res: Response): Promise<void>;
    getBookingsForAdmin(req: Request, res: Response): Promise<void>;
}