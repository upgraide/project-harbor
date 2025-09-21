import { getScopedI18n } from "@/locales/server";
import { z } from "zod";

export const passwordResetSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  confirmPassword: z
    .string()
    .min(8, { message: "Confirm password must be at least 8 characters long" }),
});

export type PasswordResetSchemaType = z.infer<typeof passwordResetSchema>;
