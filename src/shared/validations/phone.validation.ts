import { z } from "zod";

export const phoneNumberSchema = z
	.string()
	.regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" })
	.refine((val) => !/^0{10}$/.test(val), {
		message: "Phone number cannot be all zeros",
	});
