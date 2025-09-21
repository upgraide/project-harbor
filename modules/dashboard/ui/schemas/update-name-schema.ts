import { z } from "zod";

export const updateNameSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(32, { message: "Name must be at most 32 characters long" })
    .trim()
    .regex(
      /^[a-zA-Z0-9 ]+$/,
      "Name may only contain alphanumeric characters and spaces.",
    ),
});

export type UpdateNameSchemaType = z.infer<typeof updateNameSchema>;
