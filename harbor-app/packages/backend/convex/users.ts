import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { username } from "./utils";

export const getUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return;
    }
    return {
      ...user,
      name: user.name,
      avatarUrl: user.imageId
        ? await ctx.storage.getUrl(user.imageId)
        : undefined,
    };
  },
});

export const updateUsername = mutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return;
    }
    const validatedUsername = username.safeParse(args.username);

    if (!validatedUsername.success) {
      throw new Error(validatedUsername.error.message);
    }

    await ctx.db.patch(userId, { name: validatedUsername.data });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const updateUserImage = mutation({
  args: {
    newImageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return;
    }

    const oldImageId = user.imageId;

    // Update database first to avoid data loss
    await ctx.db.patch(userId, { imageId: args.newImageId });

    // Clean up old image after successful DB update
    if (oldImageId) {
      try {
        await ctx.storage.delete(oldImageId);
      } catch (error) {
        console.error("Failed to delete old image:", error);
      }
    }
  },
});

export const removeUserImage = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return;
    }
    const imageId = user.imageId;
    if (!imageId) {
      return;
    }

    await ctx.db.patch(userId, { imageId: undefined });

    try {
      await ctx.storage.delete(imageId);
    } catch (error) {
      console.error("Failed to delete image from storage:", imageId, error);
    }
  },
});
