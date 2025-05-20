import { z } from "zod";
import { passwordSchema } from "../../../../shared/validations/password.validation";

export const resetPasswordValidationSchema = z.object({
	password: passwordSchema,
	token: z.string(),
	role: z.enum(["client", "barber"], {
		message: "Invalid role",
	}),
});