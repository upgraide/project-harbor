"use server";

import { requireAdmin } from "@/data/require-auth";
import InviteNewUser from "@/emails/auth/invite-new-user";
import { auth } from "@/lib/auth";
import { resend } from "@/lib/resend";
import type { ApiResponse } from "@/lib/types/api-response";
import { generatePassword } from "@/lib/utils";
import type { InviteNewUserSchemaType } from "@/lib/zod/invite-new-user-schema";

export async function inviteNewUser(
  data: InviteNewUserSchemaType,
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    data.password = generatePassword(12);

    await auth.api.signUpEmail({
      body: {
        name: data.name, // required
        email: data.email, // required
        password: data.password, // required
        image: data.image,
        callbackURL: data.callbackURL,
      },
    });

    await resend.emails.send({
      from: "Harbor Partners <onboarding@resend.dev>",
      to: data.email,
      subject: "Welcome to Harbor Partners",
      react: InviteNewUser({
        toName: data.name,
        email: data.email,
        password: data.password,
      }),
    });

    return {
      status: "success",
      message: "New user invited successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Failed to invite new user",
    };
  }
}
