import { z } from "zod";
import { strongEmailRegex } from "../../../shared/validations/email.validation";
import { phoneNumberSchema } from "../../../shared/validations/phone.validation";

export const editBuildingValidator = z.object({
  email: strongEmailRegex.optional(),
  phone: phoneNumberSchema.optional(),
});