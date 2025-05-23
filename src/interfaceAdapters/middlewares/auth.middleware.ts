import { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { JwtService } from "../services/jwt.service";
import { NextFunction,Request, Response } from "express";
import { redisClient } from "../../frameworks/cache/redis.client";

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

export const verifyAuth = async(req:Request,res:Response,next:NextFunction)=>{
       try{
          const token = extractToken(req);
          if (!token) {
			res.status(StatusCodes.UNAUTHORIZED).json({
				success: false,
				message: "User is unauthorized",
			});
			return;
		  }

          if (await isBlacklisted(token.access_token)) {
			res.status(StatusCodes.FORBIDDEN).json({
				success: false,
				message: "Token is blacklisted",
			});
			return;
		   }

           const user = tokenService.verifyAccessToken(token.access_token) as CustomJwtPayload;
            if (!user || !user.userId) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: "Not Authorized",
                });
                return;
            }

            (req as CustomRequest).user = {
			...user,
			access_token: token.access_token,
			refresh_token: token.refresh_token,
		    };
            next();
       }catch(error: any){
           if (error.name === "TokenExpiredError") {
			console.log(error.name);
			res.status(StatusCodes.UNAUTHORIZED).json({
				message: "Not Authorized",
			});
			return;
		   }

            console.log("Invalid token response sent");
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Invalid Token",
            });
            return;
       }
}

                    /* =======================  */
                        /* Helper Functions*/ 
                    /* =======================  */

const extractToken = (req: Request): { access_token: string; refresh_token: string } | null => {
	const userType = req.path.split("/")[1];
    console.log("usertype in verifyauth",userType);
	if (!userType) return null;

	return {
		access_token: req.cookies?.[`${userType}_access_token`] ?? null,
		refresh_token: req.cookies?.[`${userType}_refresh_token`] ?? null,
	};
};

const isBlacklisted = async (token: string): Promise<boolean> => {
	try {
		const result = await redisClient.get(token);
		return result !== null;
	} catch (error) {
		console.error("Redis error:", error);
		return false;
	}
};