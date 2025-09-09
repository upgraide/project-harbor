"use server";

import { actionClient } from "./safe-action";
import { sendRequestSchema } from "./schema";

export const sendRequestAction = actionClient
  .inputSchema(sendRequestSchema)
  .action(async ({ parsedInput: data }) => {
    return data;
  });
