"use server";

import { requireAdmin } from "@/data/require-auth";
import { auth } from "@/lib/auth";
import { resend } from "@/lib/resend";
import type { ApiResponse } from "@/lib/types/api-response";
import type { InviteNewUserSchemaType } from "@/lib/zod/invite-new-user-schema";

export async function inviteNewUser(
  data: InviteNewUserSchemaType,
): Promise<ApiResponse> {
  await requireAdmin();

  try {
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
      react: ,
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
