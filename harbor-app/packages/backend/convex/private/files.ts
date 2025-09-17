import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";

/**
 * Delete a file from the storage
 *
 * @param storageId - The storage id of the file
 */
export const deleteFile = mutation({
  args: {
    opportunityId: v.id("opportunitiesMergersAndAcquisitions"),
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

    const opportunity = await ctx.db.get(args.opportunityId);

    if (!opportunity) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Opportunity not found",
      });
    }

    await ctx.storage.delete(args.storageId);

    await ctx.db.patch(args.opportunityId, {
      images: opportunity.images?.filter((image) => image !== args.storageId),
    });
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
