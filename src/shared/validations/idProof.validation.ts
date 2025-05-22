import { z } from "zod";

export const idProofSchema = z
  .string()
  .url({ message: "Invalid URL format for ID proof." })
  .refine(url =>
    url.startsWith("https://res.cloudinary.com/"), {
      message: "ID proof must be a Cloudinary URL.",
  });