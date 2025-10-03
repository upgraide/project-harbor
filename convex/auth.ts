import {
  createClient,
  type GenericCtx,
  getStaticAuth,
} from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { betterAuth } from "better-auth";
import { ConvexError } from "convex/values";
import { api, components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { type QueryCtx, query } from "./_generated/server";

const siteUrl = process.env.SITE_URL;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false }
) => {
  return betterAuth({
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly,
    },
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      sendResetPassword: async ({ user, url }) => {
        await requireActionCtx(ctx).runAction(
          api.emails.sendResetPasswordEmail,
          {
            toName: user.name,
            toEmail: user.email,
            resetPasswordLink: url,
            locale: "pt",
          }
        );
      },
    },
    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex(),
    ],
  });
};

export const auth = getStaticAuth(createAuth);

const safeGetUser = async (ctx: QueryCtx) => authComponent.safeGetAuthUser(ctx);

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => safeGetUser(ctx),
});

export const getCurrentUserId = query({
  args: {},
  handler: async (ctx) => {
    const user = await safeGetUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }
    return user._id;
  },
});
