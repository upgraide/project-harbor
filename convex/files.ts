import { api } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./auth";

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

export const saveStorageId = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  returns: v.id("files"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Identity not found",
      });
    }

    return await ctx.db.insert("files", {
      storageId: args.storageId,
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
  returns: v.array(v.id("files")),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Identity not found",
      });
    }

    const fileIds = [];

    for (const { storageId } of args.storageIds) {
      const fileId = await ctx.db.insert("files", {
        storageId,
      });
      fileIds.push(fileId);
    }

    return fileIds;
  },
});

export const getUrlById = query({
  args: {
    id: v.id("_storage"),
  },
  returns: v.union(v.string(), v.null()),
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

export const deleteFile = mutation({
  args: {
    id: v.id("_storage"),
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

    await ctx.storage.delete(args.id);
    return null;
  },
});
