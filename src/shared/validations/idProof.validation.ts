import { z } from "zod";

export const idProofSchema = z
  .string()
  .min(1, "ID proof is required")