import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";

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

/**
 * Get storage URLs for multiple storage IDs
 *
 * @param storageIds - Array of storage IDs
 * @returns Array of storage URLs
 */
export const getStorageUrls = query({
  args: {
    storageIds: v.array(v.id("_storage")),
  },
  returns: v.array(v.union(v.string(), v.null())),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    const urls = await Promise.all(
      args.storageIds.map(async (storageId) => {
        try {
          return await ctx.storage.getUrl(storageId);
        } catch (error) {
          console.error(`Failed to get URL for storage ID ${storageId}:`, error);
          return null;
        }
      })
    );

    return urls;
  },
});
