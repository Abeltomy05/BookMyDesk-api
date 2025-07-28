import { z } from "zod";

export const idProofSchema = z
  .string()
  .url({ message: "Invalid URL format for ID proof." })
  .refine(url =>
    /^[a-zA-Z0-9/_\-]+\.(jpg|jpeg|png|pdf|docx)$/i.test(url), {
      message: "ID proof must be a valid file URL.",
  });