import { NextFunction, Request, Response } from "express";

export interface IBookingController{
    getBookingPageData(req:Request, res: Response, next: NextFunction): Promise<void>;
    createPaymentIntent(req: Request, res: Response, next: NextFunction): Promise<void>;
    confirmPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBookings(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBookingDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
    cancelBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBookingsForAdmin(req: Request, res: Response, next: NextFunction): Promise<void>;
    bookingsForRevenueReport(req: Request, res: Response, next: NextFunction): Promise<void>;
}