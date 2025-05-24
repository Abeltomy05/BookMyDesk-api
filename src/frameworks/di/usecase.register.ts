import { container } from "tsyringe";
import { RegisterUserUseCase } from "../../useCases/auth/register-user.usecase";
import { passwordBcrypt } from "../security/password-bcrypt";
import { IBcrypt } from "../security/bcrypt.interface";
import { IRegisterUserUseCase } from "../../entities/usecaseInterfaces/auth/register-usecase.interface";
import { UserExistenceService } from "../../interfaceAdapters/services/user-existence.service";
import { IUserExistenceService } from "../../entities/serviceInterfaces/user-existence-service.interface";
import { SendOtpUseCase } from "../../useCases/auth/send-otp.usecase";
import { ISendOtpUseCase } from "../../entities/usecaseInterfaces/auth/send-otp-usecase.interface";
import { EmailService } from "../../interfaceAdapters/services/email.service";
import { IEmailService } from "../../entities/serviceInterfaces/email-service.interface";
import { OtpService } from "../../interfaceAdapters/services/otp.service";
import { IOtpService } from "../../entities/serviceInterfaces/otp-service.interface";
import { OtpBcrypt } from "../security/otp-bcrypt";
import { VerifyOtpUseCase } from "../../useCases/auth/verify-otp.usecase";
import { JwtService } from "../../interfaceAdapters/services/jwt.service";
import { ForgotPasswordUseCase } from "../../useCases/auth/forgot-password.usecase";
import { ResetPasswordUseCase } from "../../useCases/auth/reset-password.usecase";
import { LoginUserUseCase } from "../../useCases/auth/login-user.usecase";
import { GenerateTokenUseCase } from "../../useCases/auth/generate-token.usecase";
import { GoogleUseCase } from "../../useCases/auth/google-auth.usecase";
import { GetMe } from "../../useCases/auth/get-me.usecase";
import { IJwtService } from "../../entities/serviceInterfaces/jwt-service.interface";
import { RevokeRefreshTokenUseCase } from "../../useCases/auth/revoke-refresh-token.usecase";
import { BlackListTokenUseCase } from "../../useCases/auth/blacklist-token.usecase";
import { RefreshTokenUseCase } from "../../useCases/auth/refresh-token.usecase";
import { GetAllUsersUseCase } from "../../useCases/users/get-all-users.usecase";
import { UpdateUserStatusUseCase } from "../../useCases/users/update-user-status.usecase";

export class UseCaseRegistry{
    static registerUseCases(): void{
        //* ====== Register UseCases ====== *//
        container.register<IRegisterUserUseCase>("IRegisterUserUseCase",{
            useClass: RegisterUserUseCase,
        })
        container.register<ISendOtpUseCase>("ISendOtpUseCase",{
            useClass: SendOtpUseCase
        })
        container.register("IVerifyOtpUseCase",{
            useClass: VerifyOtpUseCase
        })
        container.register("IForgotPasswordUseCase",{
            useClass: ForgotPasswordUseCase
        })
        container.register("IResetPasswordUseCase",{
            useClass: ResetPasswordUseCase
        })
        container.register("ILoginUserUseCase",{
            useClass: LoginUserUseCase
        })
        container.register("IGenerateTokenUseCase",{
            useClass: GenerateTokenUseCase
        })
        container.register("IGoogleUseCase",{
            useClass: GoogleUseCase
        })
       container.register("IGetMeUseCase",{
        useClass:GetMe
       })
       container.register("IRevokeRefreshTokenUseCase",{
        useClass: RevokeRefreshTokenUseCase
       })
       container.register("IBlackListTokenUseCase",{
        useClass: BlackListTokenUseCase
       })
       container.register("IRefreshTokenUseCase",{
        useClass: RefreshTokenUseCase
       })
       container.register("IGetAllUsersUseCase",{
        useClass: GetAllUsersUseCase
       })
       container.register("IUpdateUserStatusUseCase",{
        useClass: UpdateUserStatusUseCase
       })



        //* ====== Register Bcrypts ====== *//
        container.register<IBcrypt>("IPasswordBcrypt",{
            useClass: passwordBcrypt
        })

        container.register("IOtpBcrypt",{
            useClass: OtpBcrypt
        })

        



         //* ====== Register Services ====== *//
         container.register<IUserExistenceService>("IUserExistenceService",{
            useClass: UserExistenceService
         })

         container.register<IEmailService>("IEmailService",{
            useClass: EmailService
         })

         container.register<IOtpService>("IOtpService",{
            useClass: OtpService
         })

        container.register<IJwtService>("IJwtService",{
            useClass: JwtService
        }) 

    }
}