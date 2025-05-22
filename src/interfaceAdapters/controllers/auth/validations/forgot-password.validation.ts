import { z } from "zod";
import { strongEmailRegex } from "../../../../shared/validations/email.validation";

export const forgotPasswordValidationSchema = z.object({
      email:strongEmailRegex,
      role: z.enum(["client", "admin", "vendor"], {
		message: "Invalid role",
	})
});