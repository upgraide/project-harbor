import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const updateUserImage = mutation({
  args: {
    newImageId: v.optional(v.id("_storage")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.auth.getCurrentUser);

    if (!user) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const oldImageId = user.image;

    // Update database first
    await ctx.db.patch(user._id, { image: args.newImageId });

    // Clean up old image after successful DB update
    if (oldImageId) {
      try {
        await ctx.storage.delete(oldImageId as Id<"_storage">);
      } catch (error) {
        console.error("Failed to delete old image:", error);
      }
    }
  },
});

export const removeUserImage = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const user = await ctx.runQuery(api.auth.getCurrentUser);

    if (!user) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const imageId = user.image;

    if (!imageId) {
      return;
    }

    // Update database first
    await ctx.db.patch(user._id, { image: undefined });

    // Clean up old image after successful DB update
    try {
      await ctx.storage.delete(imageId as Id<"_storage">);
    } catch (error) {
      console.error("Failed to delete old image:", error);
    }
  },
});
