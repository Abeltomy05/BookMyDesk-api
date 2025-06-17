import { Request, Response } from "express";
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
import { GoogleAuthDTO, LoginUserDTO, VendorDTO } from "../../../shared/dtos/user.dto";
import { loginSchema } from "./validations/user-login.validation";
import { ILoginUserUseCase } from "../../../entities/usecaseInterfaces/auth/login-usecase.interface";
import { IGenerateTokenUseCase } from "../../../entities/usecaseInterfaces/auth/generate-token.interface";
import { Schema, Types } from "mongoose";
import { IGoogleUseCase } from "../../../entities/usecaseInterfaces/auth/google-auth-usecase.interface";
import { IGetMeUseCase } from "../../../entities/usecaseInterfaces/auth/get-me-usecase.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IBlackListTokenUseCase } from "../../../entities/usecaseInterfaces/auth/blacklist-token-usecase.interface";
import { IRevokeRefreshTokenUseCase } from "../../../entities/usecaseInterfaces/auth/revoke-refreshtoken-usecase.interface";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { IRefreshTokenUseCase } from "../../../entities/usecaseInterfaces/auth/refresh-token-usecase.interface";
import { IVendorModel } from "../../../frameworks/database/mongo/models/vendor.model";


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
          private _refreshTokenUseCase: IRefreshTokenUseCase
     ){}

   async register(req: Request, res: Response): Promise<void> {
          try {
            const { role } = req.body as { role: keyof typeof userSchemas };
            const schema = userSchemas[role];
               if (!schema) {
                    res.status(400).json({ 
                         sucess: false,
                         message: "Invalid role" 
                    });
                    return;
               }
               const validatedData = schema.parse(req.body);
               await this._registerUserUseCase.execute(validatedData);
               if (role === "vendor") {
				res.status(200).json({
					success: true,
					message: "Login and complete your profile",
				});
				return;
			}
               res.status(200).json({
				success: true,
				message: "User registered successfully",
			});
          } catch (error) {
            if (error instanceof ZodError) {
               res.status(422).json({
               success: false,
               message: "Validation error",
               errors: error.flatten().fieldErrors, 
               });
          } else if (error instanceof Error && error.message) {
               res.status(400).json({
               success: false,
               message: error.message,
               });
          } else {
               console.error("Unexpected error during registration:", error);
               res.status(500).json({
               success: false,
               message: "Internal server error. Please try again later.",
               });
          }
                    }
     }

     async login(req: Request, res: Response): Promise<void> {
          try{
          const data = req.body as LoginUserDTO;
          const validatedData = loginSchema.parse(data);
          if(!validatedData){
               res.status(400).json({
                    success: false,
                    message: "Invalid email or password",
               });
               return;
          }
          const user = await this._loginUserUseCase.execute(validatedData);

          console.log("User status:", user.status, user._id, user.email, user.role);

          if (!user) {
               res.status(401).json({
                    success: false,
                    message: "Invalid email or password",
               });
               return;
          }

          const { password, ...userWithoutPassword } = user;

           if( userWithoutPassword.status === "pending" && 
              userWithoutPassword.role === "vendor"
            ){
               res.status(400).json({
                    success:false,
                    message:"Your vendor account has not yet been approved by the admin."
               });
               return;
            }

          if( userWithoutPassword.status === "rejected" && 
              userWithoutPassword.role === "vendor"
            ){
               res.status(400).json({
                    success:false,
                    message:"Your vendor account has  been rejected by the admin. Check your email for more details."
               });
               return;
            }  

            if( userWithoutPassword.status === "blocked"){
               res.status(400).json({
                    success:false,
                    message:"Your account has been blocked by the admin."
               });
               return;
            }
            
            if (!user._id || !user.email || !user.role) {
               throw new Error("User ID, email, or role is missing");
               }

          const tokens = await this._generateTokenUseCase.execute(user._id as Schema.Types.ObjectId,user.email!,user.role!);
          const accessTokenName = `${user.role}_access_token`;
		const refreshTokenName = `${user.role}_refresh_token`;


            res.cookie(accessTokenName, tokens.accessToken, {
               httpOnly: true,
               secure: process.env.NODE_ENV === "production",
               sameSite: "strict",
               maxAge: 15 * 60 * 1000, // 15 minutes
               });

               res.cookie(refreshTokenName, tokens.refreshToken, {
               httpOnly: true,
               secure: process.env.NODE_ENV === "production",
               sameSite: "strict",
               maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
               });

            res.status(200).json({
               success:true,
               message: "Login Sucess.",
               data:{
                    ...userWithoutPassword
               },
            })
          }catch(error:any){
               const message = error.message?.toLowerCase();
                 if (message?.includes("invalid password")) {
                    res.status(401).json({
                         success: false,
                         message: "Invalid email or password"
                    });
                    return;
                    }
               if (error instanceof Error) {
                    console.error("Error in login:", error.message);

                    res.status(500).json({
                         success: false,
                         message: "An unexpected error occurred during login. Please try again later.",
                         error: process.env.NODE_ENV === "development" ? error.message : undefined
                    });
               } else {
                    console.error("Unknown error in login:", error);

                    res.status(500).json({
                         success: false,
                         message:  "An unexpected error occurred.",
                    });
               }
          }
     }

     async authWithGoogle(req:Request,res:Response):Promise<void>{
          try {
               const profile = req.user as GoogleAuthDTO;
               const user = await this._googleUseCase.execute(profile);
               if (!user._id || !user.email || !user.role) {
				throw new Error("User ID, email, or role is missing");
			};

               if(user.status === "blocked"){
                    const role = user.role;
                     const redirectErrorURL = `${process.env.FRONTEND_URL}${role === "client" ? "/login" : `/${role}/login`}?error=${encodeURIComponent("Your account has been blocked by the admin.")}`;
                     return res.redirect(redirectErrorURL);
               }

               if (user.role === "vendor") {
               const status = (user as IVendorModel).status;
               const idProof = (user as IVendorModel).idProof;
               console.log("Vendor login check:", { status, idProof });
               
               if ((status === "pending" || status === "rejected") && idProof) {
               const redirectErrorURL = `${process.env.FRONTEND_URL}/vendor/login?error=${encodeURIComponent(
                    user.status === "pending"
                    ? "Your vendor account is pending admin approval."
                    : "Your vendor account has been rejected.Please check your email for more details."
               )}`;
               return res.redirect(redirectErrorURL);
               }
            } 
 
               const tokens = await this._generateTokenUseCase.execute(
				user._id as Schema.Types.ObjectId,
				user.email,
				user.role
			);

               const accessTokenName = `${user.role}_access_token`;
			const refreshTokenName = `${user.role}_refresh_token`;

               res.cookie(accessTokenName, tokens.accessToken, {
               httpOnly: true,
               secure: process.env.NODE_ENV === "production",
               sameSite: "strict",
               maxAge: 15 * 60 * 1000, // 15 minutes
               });

               res.cookie(refreshTokenName, tokens.refreshToken, {
               httpOnly: true,
               secure: process.env.NODE_ENV === "production",
               sameSite: "strict",
               maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
               });

               const redirectURL = `${process.env.FRONTEND_URL}/auth-check/${user.role}`;
               res.redirect(redirectURL);
          } catch (error) {
                console.error("Error in login:", error instanceof Error ? error.message : error);

                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                const role = req.query.state;

                const redirectErrorURL = `${process.env.FRONTEND_URL}${role === "client" ? "/login" : `/${role}/login`}?error=${encodeURIComponent(errorMessage)}`;
                res.redirect(redirectErrorURL);
          }
     }

    async getMe(req: Request, res: Response): Promise<void> {
          try {
          const token = req.cookies?.client_access_token || req.cookies?.vendor_access_token;
          if (!token) {
               res.status(401).json({ success: false, message: "Unauthorized" });
               return;
          }
  
          const user = await this._getMeUseCase.execute(token);
          console.log(user)
           if (!user) {
               res.status(404).json({ success: false, message: "User not found" });
               return;
           }

          res.json({ success: true, data: user });
          } catch (err) {
          res.status(500).json({ success: false, message: "Something went wrong" });
          }
     } 

     async sendOtp(req:Request, res:Response):Promise<void>{
          try {
               const { email } = req.body;
               await this._sendOtpUseCase.execute(email);
               res.status(200).json({
                    success: true,
                    message: "OTP sent successfully",
               });
          } catch (error:any) {
                console.error("Error sending OTP:", error);
                if (error.name === "EmailExistsError" || error.message === "Email already exists") {
                    res.status(400).json({
                         success: false,
                         message: "Email already exists",
                    });
                } else {
                    res.status(500).json({
                         success: false,
                         message: "Failed to send OTP",
                    });
                 }
          }
     }

     async verifyOtp(req: Request, res: Response): Promise<void> {
		try {
			const { email, otp } = req.body;
			const validatedData = otpMailValidationSchema.parse({ email, otp });
			await this._verifyOtpUseCase.execute(validatedData);

			res.status(200).json({
				success: true,
				message: "OTP verified successfully",
			});
		} catch (error) {
			res.status(500).json({
                    success: false,
                    message: "The OTP you entered is incorrect or has expired. Please try again or request a new OTP.",
               });
		}
	}

     async forgotPassword(req: Request, res: Response): Promise<void> {
          try {
			const validatedData = forgotPasswordValidationSchema.parse(req.body);
			if (!validatedData) {
				res.status(400).json({
					success: false,
					message: 'Invalid email format',
				});
				return;
			}
			await this._forgotPasswordUseCase.execute(validatedData.email);

			res.status(200).json({
				success: true,
				message: "Password reset link sent to your email",
			});
		} catch (error) {
			console.error("Error sending password reset link:", error);
		}   
     }

     async resetPassword(req: Request, res: Response): Promise<void> {
		try {
			const validatedData = resetPasswordValidationSchema.parse(req.body);
			if (!validatedData) {
				res.status(400).json({
					success: false,
					message: "Invalid password format",
				});
			}

			const role = await this._resetPasswordUseCase.execute(validatedData);
			res.status(200).json({
				success: true,
				message: "Password reset successfully",
                    data: role,
			});
		} catch (error) {
               console.error("Error resetting password:", error);
               res.status(500).json({
                    success: false,
                    message: "Failed to reset password",
               });
		}
	}

     async logout(req: Request, res: Response): Promise<void> {
          try{
             await this._blackListTokenUseCase.execute((req as CustomRequest).user.access_token);

             await this._revokeRefreshTokenUseCase.execute((req as CustomRequest).user.refresh_token);

             const user = (req as CustomRequest).user;
		   const accessTokenName = `${user.role}_access_token`;
		   const refreshTokenName = `${user.role}_refresh_token`;

             res.clearCookie(accessTokenName, {
               httpOnly: true,
               secure: process.env.NODE_ENV === "production",
               sameSite: "strict",
               path: "/", 
               });

             res.clearCookie(refreshTokenName, {
               httpOnly: true,
               secure: process.env.NODE_ENV === "production",
               sameSite: "strict",
               path: "/",
               });

               res.status(StatusCodes.OK).json({
			success: true,
			message: "Logout successful",
		});
          }catch(error){
             console.error("Logout error:", error); 
               res.status(500).json({
                    success: false,
                    message: "Failed to logout",
               });
          }
     }

     async handleTokenRefresh(req: Request, res: Response): Promise<void> {
		try {
			const refreshCookies  = req.cookies;
               console.log("Refresh Cookies:", refreshCookies);
               const refreshTokenKey = Object.keys(refreshCookies).find((key) =>
				key.endsWith("_refresh_token")
			);
               if (!refreshTokenKey) {
				throw new Error("No refresh token found");
			}
               const refreshToken = refreshCookies[refreshTokenKey];
			const { role, accessToken } = this._refreshTokenUseCase.execute(refreshToken);

			res.cookie(`${role}_access_token`, accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
		     });
			res.status(StatusCodes.OK).json({
				success: true,
				message: "Token refreshed successfully",
			});
		} catch (error) {
               console.error("Refresh token failed:", error);

			["client", "vendor", "admin"].forEach((role) => {
				res.clearCookie(`${role}_access_token`);
				res.clearCookie(`${role}_refresh_token`);
			});

               res.status(StatusCodes.UNAUTHORIZED).json({
				message: "Invalid refresh token",
			});
		}
	}
}  