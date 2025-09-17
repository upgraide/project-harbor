import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";

/**
 * Delete a file from the storage
 *
 * @param storageId - The storage id of the file
 */
export const deleteFile = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    await ctx.storage.delete(args.storageId);
  },
});

/**
 * Generate a upload url for a file
 *
 * @returns The upload url
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    return await ctx.storage.generateUploadUrl();
  },
});
