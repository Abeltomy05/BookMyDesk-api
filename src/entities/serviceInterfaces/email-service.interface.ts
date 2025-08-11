export interface IEmailService{
    sendOtp(to: string, subject: string, otp: string): Promise<void>;
    sendResetEmail(to: string, subject: string, resetUrl: string): Promise<void>;
    sendRejectionEmail(to: string, reason: string, retryUrl: string | null, entityLabel: string): Promise<void>;
}