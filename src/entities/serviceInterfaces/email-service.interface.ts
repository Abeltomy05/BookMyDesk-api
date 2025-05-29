export interface IEmailService{
    sendOtp(to: string, subject: string, otp: string): Promise<void>;
    sendResetEmail(to: string, subject: string, resetUrl: string): Promise<void>;
    sendVendorRejectionEmail(to: string, reason: string): Promise<void>;
}