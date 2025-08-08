import { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { JwtService } from "../services/jwt.service";
import { NextFunction,Request, Response } from "express";
import { redisClient } from "../../frameworks/cache/redis.client";
import { hasName } from "../../shared/error/errorHandler";
import { ERROR_MESSAGES } from "../../shared/constants";

const tokenService = new JwtService();

export interface CustomJwtPayload extends JwtPayload {
	userId: string;
	email: string;
	role: string;
	access_token: string;
	refresh_token: string;
}

export interface CustomRequest extends Request {
	user: CustomJwtPayload;
}

                    /* ==============================  */
                         /* Verify Auth Middleware*/ 
                    /* ==============================  */

export const verifyAuth = async(req:Request,res:Response,next:NextFunction)=>{
       try{
          const token = extractToken(req);
		  
          if (!token) {
			res.status(StatusCodes.UNAUTHORIZED).json({
				success: false,
				message: ERROR_MESSAGES.USER_UNAUTHORIZED,
			});
			return;
		  }

          if (await isBlacklisted(token.access_token)) {
			res.status(StatusCodes.FORBIDDEN).json({
				success: false,
				message: ERROR_MESSAGES.TOKEN_BLACKLISTED,
			});
			return;
		   }

           const user = tokenService.verifyAccessToken(token.access_token) as CustomJwtPayload;
            if (!user || !user.userId) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ERROR_MESSAGES.UNAUTHORIZED,
                });
                return;
            }

            (req as CustomRequest).user = {
			...user,
			access_token: token.access_token,
			refresh_token: token.refresh_token,
		    };
            next();
       }catch(error: unknown){
          if (hasName(error) && error.name === "TokenExpiredError") {
				console.log(error.name);
				res.status(StatusCodes.UNAUTHORIZED).json({
				message: ERROR_MESSAGES.UNAUTHORIZED,
				});
				return;
			}

            console.log("Invalid token response sent");
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: ERROR_MESSAGES.INVALID_TOKEN,
            });
       }
}

                    /* =======================  */
                        /* Helper Functions*/ 
                    /* =======================  */

const extractToken = (req: Request): { access_token: string; refresh_token: string } | null => {
	const userType = req.baseUrl?.split("/")[2];
	console.log("🔍 Extracting tokens for userType:", userType);
   
	if (!userType) return null;

	return {
		access_token: req.cookies?.[`${userType}_access_token`] ?? null,
		refresh_token: req.cookies?.[`${userType}_refresh_token`] ?? null,
	};
};

const isBlacklisted = async (token: string): Promise<boolean> => {
	try {
	// 	if (typeof token !== "string") {
	// 	console.error("🚨 Invalid token passed to Redis. Expected string but got:", typeof token, token);
	// 	return true;
	//    }
		const result = await redisClient.get(token);
		return result !== null;
	} catch (error) {
		console.error("Redis error:", error);
		return false;
	}
};


export const decodeToken = async (req: Request,res: Response,next: NextFunction) => {
	try {
		const token = extractToken(req);

		if (!token) {
			res.status(StatusCodes.UNAUTHORIZED).json({
				message: ERROR_MESSAGES.UNAUTHORIZED,
			});
			return;
		}
		if (await isBlacklisted(token.access_token)) {
			res.status(StatusCodes.FORBIDDEN).json({
				message: ERROR_MESSAGES.TOKEN_BLACKLISTED,
			});
			return;
		}

		const user = tokenService.decodeAccessToken(token?.access_token);
		// console.log(`Decoded`, user);
		(req as CustomRequest).user = {
			userId: user?.userId,
			email: user?.email,
			role: user?.role,
			access_token: token.access_token,
			refresh_token: token.refresh_token,
		};
		next();
	} catch (error:unknown) {
		console.error("Error decoding token:", error);

	    const message =
           error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR;

		res.status(StatusCodes.UNAUTHORIZED).json({
			message: ERROR_MESSAGES.INVALID_TOKEN,
			error: message,
		});
	}
};


                    /* ==============================  */
                         /* Authorize Role Middleware*/ 
                    /* ==============================  */

export const authorizeRole = (allowedRole:string[])=>{
	return (req: Request, res: Response, next: NextFunction) =>{
		const user = (req as CustomRequest).user;
		if(!user || !allowedRole.includes(user.role)){
			res.status(StatusCodes.FORBIDDEN).json({
				success: false,
				message: `${ERROR_MESSAGES.UNAUTHORIZED}: this route is restricted to ${user.role} users.`,
				data: user ? user.role : "none"
			})
			return;
		}
		next();
	};
};