import { getAuthUserId } from "@convex-dev/auth/server";
import { type PaginationResult, paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import { query } from "../_generated/server";

export const getManyMergersAndAcquisition = query({
  args: {
    paginationOpts: paginationOptsValidator,
    status: v.union(
      v.literal("No Interest"),
      v.literal("Interested"),
      v.literal("Completed"),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    // TODO: Check if user is admin or team at least

    let opportunities: PaginationResult<
      Doc<"opportunitiesMergersAndAcquisitions">
    >;

    if (args.status) {
      opportunities = await ctx.db
        .query("opportunitiesMergersAndAcquisitions")
        .filter((q) =>
          q.eq(
            q.field("status"),
            args.status as Doc<"opportunitiesMergersAndAcquisitions">["status"],
          ),
        )
        .order("desc")
        .paginate(args.paginationOpts);
    } else {
      opportunities = await ctx.db
        .query("opportunitiesMergersAndAcquisitions")
        .order("desc")
        .paginate(args.paginationOpts);
    }

    return opportunities;
  },
});
