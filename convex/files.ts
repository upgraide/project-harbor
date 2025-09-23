import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Identity not found",
      });
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const deleteFile = mutation({
  args: {
    id: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Identity not found",
      });
    }

    await ctx.storage.delete(args.id);

    return null;
  },
});

export const deleteFiles = mutation({
  args: {
    ids: v.array(v.id("_storage")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Identity not found",
      });
    }

    for (const id of args.ids) {
      await ctx.storage.delete(id);
    }

    return null;
  },
});

export const getUrlById = query({
  args: {
    id: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Identity not found",
      });
    }

    return await ctx.storage.getUrl(args.id);
  },
});
