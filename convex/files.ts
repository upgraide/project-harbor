import { api } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.runQuery(api.auth.getCurrentUser);

    if (!user) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const saveStorageId = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.auth.getCurrentUser);

    if (!user) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    ctx.db.patch(user._id, {
      image: args.storageId,
    });
  },
});

export const saveStorageIds = mutation({
  args: {
    storageIds: v.array(
      v.object({
        storageId: v.id("_storage"),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.auth.getCurrentUser);

    if (!user) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    // TODO: Save the storageIds to the database
  },
});

export const getUrlById = query({
  args: {
    id: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.id);
  },
});

export const deleteFile = mutation({
  args: {
    id: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.delete(args.id);
  },
});
