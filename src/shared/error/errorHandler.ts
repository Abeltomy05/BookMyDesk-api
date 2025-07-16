import { ZodError } from "zod";

export function getErrorMessage(error: unknown): string {
  if (error instanceof ZodError) {
    return error.issues.map(issue => issue.message).join(", ");
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred";
}

export function hasName(error: unknown): error is { name: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    typeof (error as any).name === "string"
  );
}