import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import logger from "../../shared/utils/error-logger";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;
    let message: string = "An unexpected server error occurred. Please try again later.";
    let errors: any[] | null = null;

    if (err instanceof ZodError) {
        statusCode = StatusCodes.BAD_REQUEST;
        message = "Validation failed. Please check the submitted data.";
        errors = err.errors.map(error => ({
            field: error.path.join("."),
            message: error.message
        }));
    }else {
        console.error("Unhandled Error:", err);
        if (err.name === "TokenExpiredError") {
            statusCode = StatusCodes.UNAUTHORIZED
            message = "Your session has expired. Please log in again."
        }
    }
    logger.error(`[${req.method}] ${req.url} - ${err.message}`, { stack: err.stack });
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors,
    });
};