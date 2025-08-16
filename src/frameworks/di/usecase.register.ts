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
import { UpdateEntityStatusUseCase  } from "../../useCases/users/update-entity-status.usecase";
import { GetUserCountUseCase } from "../../useCases/users/get-user-count.usecase";
import { UploadIdProofUseCase } from "../../useCases/vendor/upload-IdProof.usecase";
import { UpdateUserProfileUseCase } from "../../useCases/users/update-user-profile.usecase";
import { UpdateUserPasswordUseCase } from "../../useCases/users/update-password.usecase";
import { GetUserDataUseCase } from "../../useCases/users/get-user-data.usecase";
import { GetRetryDataUseCase } from "../../useCases/vendor/get-retry-data.usecase";
import { RetryRegistration } from "../../useCases/vendor/retry-registration.usecase";
import { GetAllBuildingsUsecase } from "../../useCases/building/get-all-building.usecase";
import { RegisterBuildingUsecase } from "../../useCases/building/register-building.usecase";
import { GetBuildingsForVerification } from "../../useCases/building/get-buildings-verification.usecase";
import { EditBuildingUsecase } from "../../useCases/building/edit-building.usecase";
import { GetSingleBuilding } from "../../useCases/building/get-single-building.usecase";
import { FetchBuildingUseCase } from "../../useCases/building/fetch-building.usecase";
import { GetBookingPageDataUseCase } from "../../useCases/booking/get-booking-page-data.usecase";
import { StripeService } from "../../interfaceAdapters/services/stripe.service";
import { CreatePaymentIntentUseCase } from "../../useCases/booking/create-payment-intent.usecase";
import { ConfirmPaymentUseCase } from "../../useCases/booking/confirm-payment.usecase";
import { GetBookingsUseCase } from "../../useCases/booking/bookings-get.usecase";
import { GetBookingDetailsUseCase } from "../../useCases/booking/single-booking-details";
import { CancelBookingUseCase } from "../../useCases/booking/cancel-booking.usecase";
import { GetWalletDetailsUseCase } from "../../useCases/wallet/get-walletDetails.usecase";
import { PayWithWalletUseCase } from "../../useCases/wallet/pay-with-wallet.usecase";
import { GetBookingsForAdmin } from "../../useCases/booking/get-bookings-for-admin";
import { GetVendorsAndBuildingsUseCase } from "../../useCases/users/getVendorsAndBuilding";
import { GetVendorHomeData } from "../../useCases/vendor/get-home-data.usecase";
import { CreateTopUpPaymentIntentUseCase } from "../../useCases/wallet/create-topup-payment-intent.usecase";
import { ConfirmTopupPaymentUseCase } from "../../useCases/wallet/confirm-topup-payment.usecase";
import { GetSingleVendorData } from "../../useCases/vendor/get-single-vendor-data.usecase";
import { FetchBuildingsForVendorUseCase } from "../../useCases/vendor/fetch-buildings-vendor.usecase";
import { FetchSpacesForBuilding } from "../../useCases/vendor/fetch-spaces-building.usecase";
import { FetchAllOffersUseCase } from "../../useCases/offer/fetch-all-offers.usecase";
import { CreateOfferUseCase } from "../../useCases/offer/create-offer.usecase";
import { DeleteEntityUseCase } from "../../useCases/users/delete-entity.usecase";
import { SaveFcmTokenUseCase } from "../../useCases/auth/save-fcm-token.usecase";
import { RemoveFcmTokenUseCase } from "../../useCases/auth/remove-fcm-token.usecase";
import { NotificationService } from "../../interfaceAdapters/services/notification.service";
import { GetNotificationsUseCase } from "../../useCases/notification/get-notification.usecase";
import { MarkAsReadUseCase } from "../../useCases/notification/mark-as-read.usecase";
import { CreateSessionUseCase } from "../../useCases/chat/create-session.usecase";
import { GetChatsUseCase } from "../../useCases/chat/get-chats.usecase";
import { GetMessagesUseCase } from "../../useCases/chat/get-messages.usecase";
import { ChatUseCase } from "../../useCases/chat/chat.usecase";
import { ClearChatUseCase } from "../../useCases/chat/clear-chat.usecase";
import { MonthlyBookingStats } from "../../useCases/users/get-admin-page-data.usecase";
import { RevenueReportUseCase } from "../../useCases/booking/revenue-report.usecase";
import { FetchFiltersUseCase } from "../../useCases/building/fetch-filters.usecase";
import { NotificationSocketHandler } from "../../shared/config/notificationSocket";
import { GetEveryBuildingUseCase } from "../../useCases/building/get-every-building.usecase";
import { RevenueChartDataUseCase } from "../../useCases/booking/revenue-chart-data.usecase";
import { AdminRevenueReportUseCase } from "../../useCases/booking/admin-revenue-report.usecase";
import { ClearNotificationUseCase } from "../../useCases/notification/clear-notification.usecase";
import { GetAllAmenityUseCase } from "../../useCases/amenity/get-all-amenity.usecase";
import { CreateAmenityUseCase } from "../../useCases/amenity/create-amenity.usecase";
import { EditAmenityUseCase } from "../../useCases/amenity/edit-amenity.usecase";
import { DeleteAmenityUseCase } from "../../useCases/amenity/delete-amenity.usecase";
import { GetReApplyBuildingData } from "../../useCases/building/get-reapply-building.usecase";
import { RetryBuildingRegistrationUseCase } from "../../useCases/building/retry-building-registration.usecase";
import { RequestAmenityUseCase } from "../../useCases/amenity/request-amenity.usecase";
import { PendingAmenityUseCase } from "../../useCases/amenity/pending-amenity.usecase";
import { BuildingsForClientUseCase } from "../../useCases/building/buildings-for-client.usecase";



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
       container.register("IUpdateEntityStatusUseCase",{
        useClass: UpdateEntityStatusUseCase 
       })
       container.register("IGetUserCountUseCase",{
        useClass: GetUserCountUseCase
       })
       container.register("IUploadIdProofUseCase",{
        useClass: UploadIdProofUseCase
       })
       container.register("IUpdateUserProfileUseCase",{
        useClass: UpdateUserProfileUseCase
       })
       container.register("IUpdateUserPasswordUseCase",{
        useClass: UpdateUserPasswordUseCase
       })
       container.register("IGetUserDataUseCase",{
        useClass: GetUserDataUseCase
       })
       container.register("IGetRetryDataUseCase",{
        useClass: GetRetryDataUseCase
       })
       container.register("IRetryRegistration",{
         useClass: RetryRegistration
       })
      container.register("IGetAllBuildingsUsecase",{
        useClass: GetAllBuildingsUsecase
      }) 
      container.register("IRegisterBuildingUsecase",{
        useClass: RegisterBuildingUsecase
      })
      container.register("IGetBuildingsForVerification",{
        useClass: GetBuildingsForVerification
      })
      container.register("IEditBuildingUsecase",{
        useClass: EditBuildingUsecase
      })
      container.register("IGetSingleBuilding",{
        useClass: GetSingleBuilding
      })
      container.register("IFetchBuildingUseCase",{
        useClass : FetchBuildingUseCase
      })
      container.register("IGetBookingPageDataUseCase",{
        useClass: GetBookingPageDataUseCase
      })
      container.register("ICreatePaymentIntentUseCase",{
        useClass: CreatePaymentIntentUseCase
      })
      container.register("IConfirmPaymentUseCase",{
        useClass: ConfirmPaymentUseCase
      })
      container.register("IGetBookingsUseCase",{
        useClass: GetBookingsUseCase
      })
      container.register("IGetBookingDetailsUseCase",{
        useClass: GetBookingDetailsUseCase
      })
      container.register("ICancelBookingUseCase",{
        useClass: CancelBookingUseCase
      })
      container.register("IGetWalletDetailsUseCase",{
        useClass: GetWalletDetailsUseCase
      })
      container.register("IPayWithWalletUseCase",{
        useClass: PayWithWalletUseCase
      })
      container.register("IGetBookingsForAdmin",{
        useClass: GetBookingsForAdmin
      })
      container.register("IGetVendorsAndBuildingsUseCase",{
        useClass: GetVendorsAndBuildingsUseCase
      })
      container.register("IGetVendorHomeData",{
        useClass: GetVendorHomeData
      })
      container.register("ICreateTopUpPaymentIntentUseCase",{
        useClass: CreateTopUpPaymentIntentUseCase
      })
      container.register("IConfirmTopupPaymentUseCase",{
        useClass: ConfirmTopupPaymentUseCase
      })
      container.register("IGetSingleVendorData",{
        useClass: GetSingleVendorData
      })
      container.register("IFetchBuildingsForVendorUseCase",{
        useClass: FetchBuildingsForVendorUseCase
      })
      container.register("IFetchSpacesForBuilding",{
        useClass: FetchSpacesForBuilding
      })
      container.register("IFetchAllOffersUseCase",{
        useClass: FetchAllOffersUseCase
      })
      container.register("ICreateOfferUseCase",{
        useClass: CreateOfferUseCase
      })
      container.register("IDeleteEntityUseCase",{
        useClass: DeleteEntityUseCase
      })
      container.register("ISaveFcmTokenUseCase",{
        useClass: SaveFcmTokenUseCase
      })
      container.register("IRemoveFcmTokenUseCase",{
        useClass: RemoveFcmTokenUseCase
      })
      container.register("IGetNotificationsUseCase",{
        useClass: GetNotificationsUseCase
      })
      container.register("IMarkAsReadUseCase",{
        useClass: MarkAsReadUseCase
      })
      container.register("ICreateSessionUseCase",{
        useClass: CreateSessionUseCase
      })
      container.register("IGetChatsUseCase",{
        useClass: GetChatsUseCase
      })
      container.register("IGetMessagesUseCase",{
        useClass: GetMessagesUseCase
      })
      container.register("IChatUseCase",{
        useClass: ChatUseCase
      })
      container.register("IClearChatUseCase",{
        useClass: ClearChatUseCase
      })
      container.register('IMonthlyBookingStats',{
        useClass: MonthlyBookingStats
      })
      container.register("IRevenueReportUseCase",{
        useClass: RevenueReportUseCase
      })
      container.register("IFetchFiltersUseCase",{
        useClass: FetchFiltersUseCase
      })
      container.register("IGetEveryBuildingUseCase",{
        useClass: GetEveryBuildingUseCase
      })
      container.register("IRevenueChartDataUseCase",{
        useClass: RevenueChartDataUseCase
      })
      container.register("IAdminRevenueReportUseCase",{
        useClass: AdminRevenueReportUseCase
      })
      container.register("IClearNotificationUseCase",{
        useClass: ClearNotificationUseCase
      })
      container.register("IGetAllAmenityUseCase",{
        useClass: GetAllAmenityUseCase
      })
      container.register("ICreateAmenityUseCase",{
        useClass: CreateAmenityUseCase
      })
      container.register("IEditAmenityUseCase",{
        useClass: EditAmenityUseCase
      })
      container.register("IDeleteAmenityUseCase",{
        useClass: DeleteAmenityUseCase
      })
      container.register("IGetReApplyBuildingData",{
        useClass: GetReApplyBuildingData
      })
       container.register("IRetryBuildingRegistrationUseCase",{
        useClass: RetryBuildingRegistrationUseCase
      })
      container.register("IRequestAmenityUseCase",{
        useClass: RequestAmenityUseCase
      })
      container.register("IPendingAmenityUseCase",{
        useClass: PendingAmenityUseCase
      })
      container.register("IBuildingsForClientUseCase",{
        useClass: BuildingsForClientUseCase
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
        container.register("IStripeService",{
          useClass: StripeService
        })
        container.register("INotificationService",{
          useClass: NotificationService
        })

          //* ====== Socket Services ====== *//
    }
}