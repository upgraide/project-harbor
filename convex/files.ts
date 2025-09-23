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

export const uploadImageToOpportunity = mutation({
  args: {
    storageId: v.id("_storage"),
    opportunityId: v.union(v.id("mergersAndAcquisitions"), v.id("realEstates")),
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

    const opportunity = await ctx.db.get(args.opportunityId);

    if (!opportunity) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Opportunity not found",
      });
    }

    await ctx.db.patch(args.opportunityId, {
      images: [...(opportunity.images || []), args.storageId],
    });

    return null;
  },
});

export const uploadImagesToOpportunity = mutation({
  args: {
    storageIds: v.array(
      v.object({
        storageId: v.id("_storage"),
      }),
    ),
    opportunityId: v.union(v.id("mergersAndAcquisitions"), v.id("realEstates")),
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

    const opportunity = await ctx.db.get(args.opportunityId);

    if (!opportunity) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Opportunity not found",
      });
    }

    await ctx.db.patch(args.opportunityId, {
      images: [
        ...(opportunity.images || []),
        ...args.storageIds.map(({ storageId }) => storageId),
      ],
    });

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

    return await ctx.storage.delete(args.id);
  },
});
