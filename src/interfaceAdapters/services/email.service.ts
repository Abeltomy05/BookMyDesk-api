import nodemailer from "nodemailer";
import { IEmailService } from "../../entities/serviceInterfaces/email-service.interface";
import { injectable } from "tsyringe";
import dotenv from "dotenv";
import { config } from "../../shared/config";

dotenv.config();

@injectable()
export class EmailService implements IEmailService {
   private _transporter;
   constructor() {
		this._transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: config.EMAIL_USER,
				pass: config.EMAIL_PASS,
			},

		});
	}

  private async _sendMail(mailOptions: nodemailer.SendMailOptions): Promise<void> {
    try {
      const info = await this._transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
    }

  }

async sendOtp(to: string, subject: string, otp: string): Promise<void> {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; padding: 10px 0; background-color: #f8f9fa; margin-bottom: 20px;">
          <h2 style="color: #333; margin: 0;">BookMyDesk</h2>
        </div>
        <h3 style="color: #333;">One Time Password</h3>
        <p style="color: #555; font-size: 16px;">Your verification code is:</p>
        <div style="text-align: center; margin: 20px 0;">
          <div style="font-size: 24px; font-weight: bold; letter-spacing: 5px; padding: 10px; background-color: #f5f5f5; border-radius: 4px;">${otp}</div>
        </div>
        <p style="color: #777; font-size: 14px;">This code will expire in 10 minutes. Please do not share this code with anyone.</p>
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; color: #999; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} BookMyDesk. All rights reserved.
        </div>
      </div>
    `;

    const mailOptions = {
      from: `BookMyDesk <${config.EMAIL_USER}>`,
      to,
      subject,
      text: `Your OTP is ${otp}`,
      html: htmlContent
    };
    await this._sendMail(mailOptions);
  }

async sendResetEmail(to: string, subject: string, resetUrl: string): Promise<void> {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; padding: 15px 0; background-color: #4285f4; margin-bottom: 20px;">
          <h2 style="color: white; margin: 0;">BookMyDesk</h2>
        </div>
        <h3 style="color: #333;">Password Reset Request</h3>
        <p style="color: #555; font-size: 16px;">We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #555; font-size: 14px;">If you didn't request a password reset, you can ignore this email and your password will remain unchanged.</p>
        <p style="color: #555; font-size: 14px;">Alternatively, you can copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 12px;">${resetUrl}</p>
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; color: #999; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} BookMyDesk. All rights reserved.<br>
          This email was sent automatically. Please do not reply to this email.
        </div>
      </div>
    `;

    const mailOptions = {
      from: `BookMyDesk <${config.EMAIL_USER}>`,
      to,
      subject,
      text: `Click the link to reset your password: ${resetUrl}`, 
      html: htmlContent
    };
    await this._sendMail(mailOptions);
  }

async sendVendorRejectionEmail(to: string, reason: string, retryUrl: string): Promise<void> {
  const subject = "Vendor Application Rejected - BookMyDesk";

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; padding: 15px 0; background-color: #dc3545; margin-bottom: 20px;">
        <h2 style="color: white; margin: 0;">BookMyDesk</h2>
      </div>
      <h3 style="color: #333;">Application Rejected</h3>
      <p style="color: #555; font-size: 16px;">We're sorry to inform you that your vendor registration has been rejected.</p>
      <p style="color: #555; font-size: 16px;">Reason:</p>
      <blockquote style="background-color: #f8d7da; padding: 12px; border-left: 4px solid #dc3545; font-size: 14px; color: #721c24; border-radius: 4px;">
        ${reason}
      </blockquote>
      <p style="color: #555; font-size: 14px;">If you'd like to update your information and try again, click the button below:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${retryUrl}" style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
          Retry Application
        </a>
      </div>
      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; color: #999; font-size: 12px; text-align: center;">
        &copy; ${new Date().getFullYear()} BookMyDesk. All rights reserved.<br>
        This is an automated message, please do not reply.
      </div>
    </div>
  `;

  const mailOptions = {
    from: `BookMyDesk <${config.EMAIL_USER}>`,
    to,
    subject,
    text: `Your vendor application has been rejected. Reason: ${reason}`,
    html: htmlContent
  };

  await this._sendMail(mailOptions);
}

async sendBuildingRejectionEmail(to: string, reason: string, retryUrl: string): Promise<void> {
  const subject = "Building Registration Rejected - BookMyDesk";

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; padding: 15px 0; background-color: #dc3545; margin-bottom: 20px;">
        <h2 style="color: white; margin: 0;">BookMyDesk</h2>
      </div>
      <h3 style="color: #333;">Building Rejected</h3>
      <p style="color: #555; font-size: 16px;">We regret to inform you that your building registration has been rejected.</p>
      <p style="color: #555; font-size: 16px;">Reason:</p>
      <blockquote style="background-color: #f8d7da; padding: 12px; border-left: 4px solid #dc3545; font-size: 14px; color: #721c24; border-radius: 4px;">
        ${reason}
      </blockquote>
      <p style="color: #555; font-size: 14px;">If you'd like to update your information and try again, click the button below:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${retryUrl}" style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
          Retry Application
        </a>
      </div>     
      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; color: #999; font-size: 12px; text-align: center;">
        &copy; ${new Date().getFullYear()} BookMyDesk. All rights reserved.<br>
        This is an automated message, please do not reply.
      </div>
    </div>
  `;

  const mailOptions = {
    from: `BookMyDesk <${config.EMAIL_USER}>`,
    to,
    subject,
    text: `Your building registration has been rejected. Reason: ${reason}`,
    html: htmlContent
  };

  await this._sendMail(mailOptions);
}

}