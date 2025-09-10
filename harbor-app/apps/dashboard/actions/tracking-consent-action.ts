"use server";

import { addYears } from "date-fns";
import { cookies } from "next/headers";
import { z } from "zod";
import { actionClient } from "@/actions/safe-action";
import { Cookies } from "@/utils/constants";

export const trackingConsentAction = actionClient
  .schema(z.boolean())
  .action(async ({ parsedInput: value }) => {
    (await cookies()).set({
      name: Cookies.TrackingConsent,
      value: value ? "1" : "0",
      expires: addYears(new Date(), 1),
    });

    return value;
  });
