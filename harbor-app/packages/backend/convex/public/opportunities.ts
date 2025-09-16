import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { query } from "../_generated/server";

export const getManyMergersAndAcquisition = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    const opportunities = await ctx.db
      .query("opportunitiesMergersAndAcquisitions")
      .order("desc")
      .paginate(args.paginationOpts);

    return opportunities;
  },
});

export const getOpportunityById = query({
  args: {
    opportunityId: v.id("opportunitiesMergersAndAcquisitions"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
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

    return opportunity;
  },
});
