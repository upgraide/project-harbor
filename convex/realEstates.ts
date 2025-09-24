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

    // Post-NDA Fields
    license: v.optional(v.union(v.null(), v.string())),
    irr: v.optional(v.union(v.null(), v.number())),
    coc: v.optional(v.union(v.null(), v.number())),
    licenseStage: v.optional(v.union(v.null(), v.string())),
    holdingPeriod: v.optional(v.union(v.null(), v.number())),
    breakEvenOccupancy: v.optional(v.union(v.null(), v.number())),
    vacancyRate: v.optional(v.union(v.null(), v.number())),
    estimatedRentValue: v.optional(v.union(v.null(), v.number())),
    occupancyRate: v.optional(v.union(v.null(), v.number())),
    moic: v.optional(v.union(v.null(), v.number())),
    price: v.optional(v.union(v.null(), v.number())),
    totalInvestment: v.optional(v.union(v.null(), v.number())),
    profitOnCost: v.optional(v.union(v.null(), v.number())),
    profit: v.optional(v.union(v.null(), v.number())),
    sofCosts: v.optional(v.union(v.null(), v.number())),
    sellPerSqm: v.optional(v.union(v.null(), v.number())),
    gdv: v.optional(v.union(v.null(), v.number())),
    wault: v.optional(v.union(v.null(), v.number())),
    debtServiceCoverageRatio: v.optional(v.union(v.null(), v.number())),
    expectedExitYield: v.optional(v.union(v.null(), v.number())),
    ltv: v.optional(v.union(v.null(), v.number())),
    ltc: v.optional(v.union(v.null(), v.number())),
    yieldOnCost: v.optional(v.union(v.null(), v.number())),

    images: v.optional(v.union(v.null(), v.array(v.id("_storage")))),

    // Co-Investment Fields
    coInvestment: v.optional(v.union(v.boolean(), v.null())),
    gpEquityValue: v.optional(v.union(v.number(), v.null())),
    gpEquityPercentage: v.optional(v.union(v.number(), v.null())),
    totalEquityRequired: v.optional(v.union(v.number(), v.null())),
    sponsorPresentation: v.optional(v.union(v.null(), v.string())),
    promoteStructure: v.optional(v.union(v.null(), v.string())),
    projectIRR: v.optional(v.union(v.number(), v.null())),
    investorIRR: v.optional(v.union(v.number(), v.null())),
    coInvestmentHoldPeriod: v.optional(v.union(v.number(), v.null())),
    coInvestmentBreakEvenOccupancy: v.optional(v.union(v.number(), v.null())),
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

    const opportunity = await ctx.db.get(args.id);

    if (!opportunity) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Opportunity not found",
      });
    }

    const user = await authComponent.getAnyUserById(ctx, opportunity.createdBy);

    const imagesUrls = opportunity.images
      ? await Promise.all(
          opportunity.images.map(async (image) => {
            return await ctx.storage.getUrl(image);
          }),
        )
      : undefined;

    return {
      ...opportunity,
      createdBy: user?._id
        ? {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatarURL: user.image
              ? await ctx.storage.getUrl(user.image)
              : undefined,
          }
        : null,
      imagesUrls,
    };
  },
});
