import { z } from "zod";

export const idProofSchema = z
  .string()
  .url({ message: "Invalid URL format for ID proof." })
  .refine(url =>
    /^https:\/\/(res\.cloudinary\.com|utfs\.io|uploadthing-prod.*|.+\.ufs\.sh)/.test(url), {
      message: "ID proof must be a valid file URL.",
  });