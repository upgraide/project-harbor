import { z } from "zod";

const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 32;

export const updateNameSchema = z.object({
  name: z
    .string()
    .min(NAME_MIN_LENGTH, {
      message: "Name must be at least 3 characters long",
    })
    .max(NAME_MAX_LENGTH, {
      message: "Name must be at most 32 characters long",
    })
    .trim()
    .regex(
      /^[a-zA-Z0-9 ]+$/,
      "Name may only contain alphanumeric characters and spaces."
    ),
});

export type UpdateNameSchemaType = z.infer<typeof updateNameSchema>;
