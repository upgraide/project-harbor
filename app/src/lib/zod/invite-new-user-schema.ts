import { z } from "zod";

export const inviteNewUserSchema = z.object({
  name: z.string().min(2).max(128),
  email: z.string().email(),
  password: z.string().min(8).max(128).optional(),
  image: z.string().url().optional(),
  callbackURL: z.string().url().optional(),
});

export type InviteNewUserSchemaType = z.infer<typeof inviteNewUserSchema>;
