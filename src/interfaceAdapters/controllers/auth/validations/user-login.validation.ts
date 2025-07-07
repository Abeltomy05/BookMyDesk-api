import { z } from "zod";
import { strongEmailRegex } from "../../../../shared/validations/email.validation";
import { passwordSchema } from "../../../../shared/validations/password.validation";

export const loginSchema = z.object({
    email:strongEmailRegex,
    password:passwordSchema,
    role: z.enum(["client", "admin", "vendor"],{
        message: "Invalid role",
    }),
    fcmToken: z.string().optional(),
})