import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { paginationOptsValidator, PaginationResult } from "convex/server";
import { Doc } from "./_generated/dataModel";

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.union(v.null(), v.string())),
    asset: v.optional(
      v.union(
        v.literal("Agnostic"),
        v.literal("Mixed"),
        v.literal("Hospitality"),
        v.literal("Logistics & Industrial"),
        v.literal("Office"),
        v.literal("Residential"),
        v.literal("Senior Living"),
        v.literal("Shopping Center"),
        v.literal("Street Retail"),
        v.literal("Student Housing"),
        v.null(),
      ),
    ),
    nRoomsLastYear: v.optional(v.union(v.null(), v.number())),
    noi: v.optional(v.union(v.null(), v.number())),
    occupancyLastYear: v.optional(v.union(v.null(), v.number())),
    walt: v.optional(v.union(v.null(), v.number())),
    nBeds: v.optional(v.union(v.null(), v.number())),
    investment: v.optional(
      v.union(
        v.literal("Lease and Operation"),
        v.literal("S&L"),
        v.literal("Core"),
        v.literal("Fix&Flip"),
        v.literal("Refurbishment"),
        v.literal("Value-add"),
        v.literal("Opportunistic"),
        v.literal("Development"),
        v.null(),
      ),
    ),
    subRent: v.optional(v.union(v.null(), v.number())),
    rentPerSqm: v.optional(v.union(v.null(), v.number())),
    subYield: v.optional(v.union(v.null(), v.number())),
    capex: v.optional(v.union(v.null(), v.number())),
    capexPerSqm: v.optional(v.union(v.null(), v.number())),
    sale: v.optional(v.union(v.null(), v.number())),
    salePerSqm: v.optional(v.union(v.null(), v.number())),
    location: v.optional(v.union(v.null(), v.string())),
    area: v.optional(v.union(v.null(), v.number())),
    value: v.optional(v.union(v.null(), v.number())),
    yield: v.optional(v.union(v.null(), v.number())),
    rent: v.optional(v.union(v.null(), v.number())),
    gcaAboveGround: v.optional(v.union(v.null(), v.number())),
    gcaBelowGround: v.optional(v.union(v.null(), v.number())),
  },
  returns: v.id("realEstates"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }

    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "User not found",
      });
    }

    return await ctx.db.insert("realEstates", {
      ...args,
      createdBy: user._id,
    });
  },
});

export const getMany = query({
  args: {
    paginationOpts: paginationOptsValidator,
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }

    let opportunities: PaginationResult<Doc<"realEstates">>;

    if (args.name) {
      opportunities = await ctx.db
        .query("realEstates")
        .withSearchIndex("search_name", (q) =>
          q.search("name", args.name ?? ""),
        )
        .paginate(args.paginationOpts);
    } else {
      opportunities = await ctx.db
        .query("realEstates")
        .order("desc")
        .paginate(args.paginationOpts);
    }

    const enrichedOpportunities = await Promise.all(
      opportunities.page.map(async (opportunity) => {
        const user = await authComponent.getAnyUserById(
          ctx,
          opportunity.createdBy,
        );
        return {
          ...opportunity,
          createdBy: user?._id
            ? {
                _id: user?._id,
                name: user?.name,
                email: user?.email,
                avatarURL: user?.image
                  ? await ctx.storage.getUrl(user.image)
                  : undefined,
              }
            : null,
        };
      }),
    );

    return {
      ...opportunities,
      page: enrichedOpportunities,
    };
  },
});

export const getById = query({
  args: {
    id: v.id("realEstates"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }

    return await ctx.db.get(args.id);
  },
});
