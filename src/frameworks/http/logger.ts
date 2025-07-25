import fs from "fs";
import path from "path";
import morgan from "morgan";
import { config } from "../../shared/config";
import { NextFunction, Request, Response } from "express";

const logDirectory = path.resolve(__dirname, "../../../logs");

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

const accessLogStream = fs.createWriteStream(path.join(logDirectory, "access.log"), { flags: "a" });

morgan.token("date", () => new Date().toISOString()); // Custom date format
morgan.token("custom-status", (req, res) => `\x1b${res.statusCode}\x1b[0m`); // Colorize status codes

const customFormat = `:remote-addr - :method :url :status :response-time ms - :res[content-length] bytes [:date]`;


const logFormat = config.LOGGER_STATUS || "combined";

const morganLogger = (req: Request, res: Response, next: NextFunction) => {
    if (logFormat) {
        morgan(customFormat, { stream: accessLogStream })(req, res, () => { });

        morgan(logFormat)(req, res, next);
    } else {
        next();
    }
}; (req: Request, res: Response, next: NextFunction) => {
    if (logFormat) {
        morgan(logFormat, { stream: accessLogStream })(req, res, () => { });

        morgan(logFormat)(req, res, next);
    } else {
        next();
    }
};

export default morganLogger;