import { Request, Response,NextFunction } from "express";
import { IAuthController } from "../../../entities/controllerInterfaces/auth/auth-controller.interface";
import { userSchemas } from "./validations/user-signup.validation.schema";
import { inject, injectable } from "tsyringe";
import { IRegisterUserUseCase } from "../../../entities/usecaseInterfaces/auth/register-usecase.interface";
import { ISendOtpUseCase } from "../../../entities/usecaseInterfaces/auth/send-otp-usecase.interface";
import { otpMailValidationSchema } from "./validations/otp-mail.validation";
import { forgotPasswordValidationSchema } from "./validations/forgot-password.validation";
import { resetPasswordValidationSchema } from "./validations/reset-password.validation";
import { IVerifyOtpUseCase } from "../../../entities/usecaseInterfaces/auth/verify-otp-usecase.interface";
import { IForgotPasswordUseCase } from "../../../entities/usecaseInterfaces/auth/forgot-pasword-usecase.interface";
import { IResetPasswordUseCase } from "../../../entities/usecaseInterfaces/auth/reset-password.interface";
import { GoogleAuthDTO, LoginUserDTO } from "../../../shared/dtos/user.dto";
import { loginSchema } from "./validations/user-login.validation";
import { ILoginUserUseCase } from "../../../entities/usecaseInterfaces/auth/login-usecase.interface";
import { IGenerateTokenUseCase } from "../../../entities/usecaseInterfaces/auth/generate-token.interface";
import { Schema } from "mongoose";
import { IGoogleUseCase } from "../../../entities/usecaseInterfaces/auth/google-auth-usecase.interface";
import { IGetMeUseCase } from "../../../entities/usecaseInterfaces/auth/get-me-usecase.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IBlackListTokenUseCase } from "../../../entities/usecaseInterfaces/auth/blacklist-token-usecase.interface";
import { IRevokeRefreshTokenUseCase } from "../../../entities/usecaseInterfaces/auth/revoke-refreshtoken-usecase.interface";
import { StatusCodes } from "http-status-codes";
import { IRefreshTokenUseCase } from "../../../entities/usecaseInterfaces/auth/refresh-token-usecase.interface";
import { IVendorModel } from "../../../frameworks/database/mongo/models/vendor.model";
import { ISaveFcmTokenUseCase } from "../../../entities/usecaseInterfaces/auth/save-fcm-token-usecase.interface";
import { IRemoveFcmTokenUseCase } from "../../../entities/usecaseInterfaces/auth/remove-fcm-token-usecase.interface";
import { getErrorMessage } from "../../../shared/error/errorHandler";
import { config } from "../../../shared/config";
import { CustomError } from "../../../entities/utils/custom.error";
import { ERROR_MESSAGES, INFO_MESSAGES, SUCCESS_MESSAGES, ALLOWED_ROLES } from "../../../shared/constants";
import { IRedisTokenRepository } from "../../../entities/repositoryInterfaces/redis/redis-token-repository.interface";
import { AllowedRole } from "../../../shared/dtos/types/user.types";


@injectable()
export class AuthController implements IAuthController {
     constructor(
          @inject("IRegisterUserUseCase")
          private _registerUserUseCase: IRegisterUserUseCase,
          @inject("ISendOtpUseCase")
          private _sendOtpUseCase: ISendOtpUseCase,
          @inject("IVerifyOtpUseCase")
          private _verifyOtpUseCase: IVerifyOtpUseCase,
          @inject("IForgotPasswordUseCase")
          private _forgotPasswordUseCase: IForgotPasswordUseCase,
          @inject("IResetPasswordUseCase")
          private _resetPasswordUseCase: IResetPasswordUseCase,
          @inject("ILoginUserUseCase")
          private _loginUserUseCase: ILoginUserUseCase,
          @inject("IGenerateTokenUseCase")
          private _generateTokenUseCase: IGenerateTokenUseCase,
          @inject("IGoogleUseCase")
          private _googleUseCase: IGoogleUseCase,
          @inject("IGetMeUseCase")
          private _getMeUseCase: IGetMeUseCase,
          @inject("IBlackListTokenUseCase")
          private _blackListTokenUseCase: IBlackListTokenUseCase,
          @inject("IRevokeRefreshTokenUseCase")
          private _revokeRefreshTokenUseCase: IRevokeRefreshTokenUseCase,
          @inject("IRefreshTokenUseCase")
          private _refreshTokenUseCase: IRefreshTokenUseCase,
          @inject("ISaveFcmTokenUseCase")
          private _saveFcmTokenUseCase: ISaveFcmTokenUseCase,
          @inject("IRemoveFcmTokenUseCase")
          private _removeFcmTokenUseCase: IRemoveFcmTokenUseCase,
          @inject("IRedisTokenRepository")
          private _redisRepo: IRedisTokenRepository, 
     ){}

   async register(req: Request, res: Response, next: NextFunction): Promise<void> {
          try {
            const { role,email } = req.body as { role: keyof typeof userSchemas; email:string };
            if (!ALLOWED_ROLES.includes(role as AllowedRole)) {
               res.status(StatusCodes.BAD_REQUEST).json({
               success: false,
               message: "Invalid role",
               });
               return
            }
            const isVerified = await this._redisRepo.isEmailVerified(email);
            if (!isVerified) {
               res.status(StatusCodes.BAD_REQUEST).json({
               success: false,
               message: ERROR_MESSAGES.OTP_NOT_VERIFIED,
               });
               return;
            }

            const schema = userSchemas[role];
               if (!schema) {
                    res.status(StatusCodes.BAD_REQUEST).json({ 
                         sucess: false,
                         message: ERROR_MESSAGES.INVALID_ROLE,
                    });
                    return;
               }
               
               const validatedData = schema.parse(req.body);
               await this._registerUserUseCase.execute(validatedData);
               if (role === "vendor") {
				res.status(StatusCodes.OK).json({
					success: true,
					message: SUCCESS_MESSAGES.VENDOR_REGISTERED,
				});
				return;
			}
               res.status(StatusCodes.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.USER_REGISTERED,
			});
          } catch (error) {
             next(error)
          }
     }

     async login(req: Request, res: Response, next: NextFunction): Promise<void> {
          try{
          const data = req.body as LoginUserDTO;
          const validatedData = loginSchema.parse(data);
          if(!validatedData){
               res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.INVALID_CREDENTIALS,
               });
               return;
          }
          const user = await this._loginUserUseCase.execute(validatedData);


          if (!user) {
               res.status(401).json({
                    success: false,
                    message: ERROR_MESSAGES.INVALID_CREDENTIALS,
               });
               return;
          }

          const { password, ...userWithoutPassword } = user;

           if( userWithoutPassword.status === "pending" && 
              userWithoutPassword.role === "vendor"
            ){
               res.status(StatusCodes.BAD_REQUEST).json({
                    success:false,
                    message:ERROR_MESSAGES.VENDOR_PENDING
               });
               return;
            }

          if( userWithoutPassword.status === "rejected" && 
              userWithoutPassword.role === "vendor"
            ){
               res.status(StatusCodes.BAD_REQUEST).json({
                    success:false,
                    message:ERROR_MESSAGES.VENDOR_REJECTED
               });
               return;
            }  

            if( userWithoutPassword.status === "blocked"){
               res.status(StatusCodes.BAD_REQUEST).json({
                    success:false,
                    message:ERROR_MESSAGES.USER_BLOCKED
               });
               return;
            }
            
            if (!user._id || !user.email || !user.role) {
               throw new CustomError(ERROR_MESSAGES.MISSING_TOKEN_DATA,StatusCodes.BAD_REQUEST);
               }

          const tokens = await this._generateTokenUseCase.execute(user._id as Schema.Types.ObjectId,user.email!,user.role!);
          const accessTokenName = "access_token";
		const refreshTokenName = "refresh_token";


            res.cookie(accessTokenName, tokens.accessToken, {
               httpOnly: true,
               secure: config.NODE_ENV === "production",
               sameSite: "strict",
               maxAge: 15 * 60 * 1000, // 15 minutes
               });

               res.cookie(refreshTokenName, tokens.refreshToken, {
               httpOnly: true,
               secure: config.NODE_ENV === "production",
               sameSite: "strict",
               maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
               });

            res.status(StatusCodes.OK).json({
               success:true,
               message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
               data:{
                    ...userWithoutPassword
               },
            })
          }catch(error){
             next(error)
          }
     }

     async authWithGoogle(req:Request,res:Response):Promise<void>{
          try {
               const profile = req.user as GoogleAuthDTO;
               const user = await this._googleUseCase.execute(profile);
               if (!user._id || !user.email || !user.role) {
				throw new CustomError(ERROR_MESSAGES.MISSING_TOKEN_DATA, StatusCodes.BAD_REQUEST);
			};

               if(user.status === "blocked"){
                    const role = user.role;
                     const redirectErrorURL = `${config.FRONTEND_URL}${role === "client" ? "/login" : `/${role}/login`}?error=${encodeURIComponent("Your account has been blocked by the admin.")}`;
                     return res.redirect(redirectErrorURL);
               }

               if (user.role === "vendor") {
               const status = (user as IVendorModel).status;
               const idProof = (user as IVendorModel).idProof;
               console.log("Vendor login check:", { status, idProof });
               
               if ((status === "pending" || status === "rejected") && idProof) {
               const redirectErrorURL = `${config.FRONTEND_URL}/vendor/login?error=${encodeURIComponent(
                    user.status === "pending"
                    ? INFO_MESSAGES.REDIRECT_VENDOR_PENDING
                    : INFO_MESSAGES.REDIRECT_VENDOR_REJECTED
               )}`;
               return res.redirect(redirectErrorURL);
               }
            } 
 
               const tokens = await this._generateTokenUseCase.execute(
				user._id as Schema.Types.ObjectId,
				user.email,
				user.role
			);

               const accessTokenName = "access_token";
               const refreshTokenName = "refresh_token";

               res.cookie(accessTokenName, tokens.accessToken, {
               httpOnly: true,
               secure: config.NODE_ENV === "production",
               sameSite: "strict",
               maxAge: 15 * 60 * 1000, // 15 minutes
               });

               res.cookie(refreshTokenName, tokens.refreshToken, {
               httpOnly: true,
               secure: config.NODE_ENV === "production",
               sameSite: "strict",
               maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
               });

               const redirectURL = `${config.FRONTEND_URL}/auth-check/${user.role}`;
               res.redirect(redirectURL);
          } catch (error:unknown) {
                const message = getErrorMessage(error);
                console.error("Error in login:", error instanceof Error ? error.message : error);

                const errorMessage = message;
                const role = req.query.state;

                const redirectErrorURL = `${config.FRONTEND_URL}${role === "client" ? "/login" : `/${role}/login`}?error=${encodeURIComponent(errorMessage)}`;
                res.redirect(redirectErrorURL);
          }
     }

    async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
          try {
          const token = req.cookies?.access_token;
          if (!token) {
               res.status(401).json({ success: false, message: ERROR_MESSAGES.UNAUTHORIZED });
               return;
          }
  
          const user = await this._getMeUseCase.execute(token);
          console.log(user)
           if (!user) {
               res.status(404).json({ success: false, message: ERROR_MESSAGES.USER_NOT_FOUND });
               return;
           }

          res.json({ success: true, data: user });
          } catch (error) {
           next(error)
          }
     } 

    async saveFcmToken(req: Request, res: Response, next: NextFunction): Promise<void>{
          try {
         const {fcmToken, userId, role} = req.body;
  
     if (!fcmToken || !userId || !role) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.MISSING_DATA });
        return;
     }

     await this._saveFcmTokenUseCase.execute(fcmToken, userId, role);

     res.json({ success: true });
     } catch (error) {
           next(error)
     }
    }

     async sendOtp(req:Request, res:Response, next: NextFunction):Promise<void>{
          try {
               const { email } = req.body;
               await this._sendOtpUseCase.execute(email);
               res.status(StatusCodes.OK).json({
                    success: true,
                    message: SUCCESS_MESSAGES.OTP_SENT,
               });
          } catch (error) {
               next(error)
          }
     }

     async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email, otp } = req.body;
			const validatedData = otpMailValidationSchema.parse({ email, otp });
			await this._verifyOtpUseCase.execute(validatedData);

			res.status(StatusCodes.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.OTP_VERIFIED,
			});
		} catch (error) {
             next(error)
		}
	}

     async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
          try {
			const validatedData = forgotPasswordValidationSchema.parse(req.body);
			if (!validatedData) {
				res.status(StatusCodes.BAD_REQUEST).json({
					success: false,
					message: ERROR_MESSAGES.INVALID_EMAIL_FORMAT,
				});
				return;
			}
			await this._forgotPasswordUseCase.execute(validatedData.email);

			res.status(StatusCodes.OK).json({
				success: true,
				message:SUCCESS_MESSAGES.PASSWORD_RESET_LINK_SENT,
			});
		} catch (error) {
            next(error)
		}   
     }

     async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const validatedData = resetPasswordValidationSchema.parse(req.body);
			if (!validatedData) {
				res.status(StatusCodes.BAD_REQUEST).json({
					success: false,
					message:ERROR_MESSAGES.INVALID_PASSWORD_FORMAT,
				});
			}

			const role = await this._resetPasswordUseCase.execute(validatedData);
			res.status(StatusCodes.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS,
                    data: role,
			});
		} catch (error) {
            next(error)
		}
	}

     async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
          try{
             await this._blackListTokenUseCase.execute((req as CustomRequest).user.access_token);

             await this._revokeRefreshTokenUseCase.execute((req as CustomRequest).user.refresh_token);

             await this._removeFcmTokenUseCase.execute((req as CustomRequest).user.userId,(req as CustomRequest).user.role);

             const user = (req as CustomRequest).user;
            const accessTokenName = "access_token";
            const refreshTokenName = "refresh_token";
  
             res.clearCookie(accessTokenName, {
               httpOnly: true,
               secure: config.NODE_ENV === "production",
               sameSite: "strict",
               path: "/", 
               });

             res.clearCookie(refreshTokenName, {
               httpOnly: true,
               secure: config.NODE_ENV === "production",
               sameSite: "strict",
               path: "/",
               });

               res.status(StatusCodes.OK).json({
			success: true,
			message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
		});
          }catch(error){
           next(error)
          }
     }

     async handleTokenRefresh(req: Request, res: Response): Promise<void> {
		try {
			const refreshToken = req.cookies?.["refresh_token"];

               if (!refreshToken) {
				throw new CustomError(ERROR_MESSAGES.REFRESH_TOKEN_MISSING, StatusCodes.UNAUTHORIZED);
			}

			const { accessToken } = this._refreshTokenUseCase.execute(refreshToken);

			res.cookie("access_token", accessToken, {
			httpOnly: true,
			secure: config.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
		     });
			res.status(StatusCodes.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.TOKEN_REFRESHED,
			});
		} catch (error:unknown) {
                const message = getErrorMessage(error);
               console.error("Refresh token failed:", error);

			res.clearCookie("access_token", {
                    httpOnly: true,
                    secure: config.NODE_ENV === "production",
                    sameSite: "strict",
                    path: "/",
               });

               res.clearCookie("refresh_token", {
                    httpOnly: true,
                    secure: config.NODE_ENV === "production",
                    sameSite: "strict",
                    path: "/",
               });

               res.status(StatusCodes.UNAUTHORIZED).json({
				message,
			});
		}
	}
}  