import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import logger from "../../shared/utils/error-logger";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES } from "../../shared/constants";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;
    let message: string = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    let errors: any[] | null = null;

    if (err instanceof ZodError) {
        statusCode = StatusCodes.BAD_REQUEST;
        message = ERROR_MESSAGES.VALIDATION_FAILED;
        errors = err.errors.map(error => ({
            field: error.path.join("."),
            message: error.message
        }));
    }else if (err instanceof CustomError) {
        statusCode = err.statusCode;
        message = err.message;
    } else {
        console.error("Unhandled Error:", err);
        if (err.name === "TokenExpiredError") {
            statusCode = StatusCodes.UNAUTHORIZED
            message = ERROR_MESSAGES.SESSION_EXPIRED
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