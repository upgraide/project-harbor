import { z } from "zod";

export const sendRequestSchema = z.object({
  email: z.email(),
  fullName: z.string(),
  subject: z.string(),
  priority: z.string(),
  type: z.string(),
  message: z.string(),
});
