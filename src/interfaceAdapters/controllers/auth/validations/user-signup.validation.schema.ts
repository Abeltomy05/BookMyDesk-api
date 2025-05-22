import { z } from "zod";
import { strongEmailRegex } from "../../../../shared/validations/email.validation";
import { nameSchema } from "../../../../shared/validations/name.validation";
import { passwordSchema } from "../../../../shared/validations/password.validation";
import { phoneNumberSchema } from "../../../../shared/validations/phone.validation";
import { idProofSchema } from "../../../../shared/validations/idProof.validation";

const adminSchema = z.object({
	email: strongEmailRegex,
	password: passwordSchema,
	role: z.literal("admin"),
});

const clientSchema = z.object({
	username: nameSchema,
	email: strongEmailRegex,
	phone: phoneNumberSchema,
	password: passwordSchema,
	role: z.literal("client"),
});

const vendorSchema = z.object({
    username: nameSchema,
    email: strongEmailRegex,
    phone: phoneNumberSchema,
    password: passwordSchema,
    role: z.literal("vendor"),
    companyName: z.string().max(50),
    companyAddress: z.string().max(100),
	idProof: idProofSchema,
})

export const userSchemas = {
	admin: adminSchema,
	client: clientSchema,
	vendor: vendorSchema,
};