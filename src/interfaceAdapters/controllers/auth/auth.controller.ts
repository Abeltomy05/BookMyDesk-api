import { Request, Response } from "express";
import { IAuthController } from "../../../entities/controllerInterfaces/users/auth-controller.interface";
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
          private _getMeUseCase: IGetMeUseCase
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
          if (!user._id || !user.email || !user.role) {
				throw new Error("User ID, email, or role is missing");
			};

          if (!user) {
               res.status(401).json({
                    success: false,
                    message: "Invalid email or password",
               });
               return;
          }
          const tokens = await this._generateTokenUseCase.execute(user._id as Schema.Types.ObjectId,user.email!,user.role!);
          const accessTokenName = `${user.role}_access_token`;
		const refreshTokenName = `${user.role}_refresh_token`;

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
          }catch(error:unknown){
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
                         message: "An unexpected error occurred.",
                    });
               }
          }
     }

     async authWithGoogle(req:Request,res:Response):Promise<void>{
          try {
               const profile = req.user as GoogleAuthDTO;
               const user = await this._googleUseCase .execute(profile);
               if (!user._id || !user.email || !user.role) {
				throw new Error("User ID, email, or role is missing");
			};

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
                         message: "An unexpected error occurred.",
                    });
               } 
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
                    message: "Failed to verify OTP",
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
			await this._forgotPasswordUseCase.execute(validatedData);

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

			await this._resetPasswordUseCase.execute(validatedData);
			res.status(200).json({
				success: true,
				message: "Password reset successfully",
			});
		} catch (error) {
               console.error("Error resetting password:", error);
               res.status(500).json({
                    success: false,
                    message: "Failed to reset password",
               });
		}
	}
}  