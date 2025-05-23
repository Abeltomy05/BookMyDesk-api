import { z } from "zod";
import { strongEmailRegex } from "../../../../shared/validations/email.validation";

export const forgotPasswordValidationSchema = z.object({
      email:strongEmailRegex,
});