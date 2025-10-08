import { type PaginationResult, paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const create = mutation({
  args: {
    name: v.string(),
    images: v.optional(v.union(v.null(), v.array(v.id("_storage")))),
    type: v.optional(
      v.union(
        v.literal("Buy In"),
        v.literal("Buy Out"),
        v.literal("Buy In/Buy Out"),
        v.null()
      )
    ),
    typeDetails: v.optional(
      v.union(
        v.literal("Maioritário"),
        v.literal("Minoritário"),
        v.literal("100%"),
        v.null()
      )
    ),
    industry: v.optional(
      v.union(
        v.literal("Services"),
        v.literal("Transformation Industry"),
        v.literal("Trading"),
        v.literal("Energy & Infrastructure"),
        v.literal("Fitness"),
        v.literal("Healthcare & Pharmaceuticals"),
        v.literal("IT"),
        v.literal("TMT (Technology, Media & Telecom)"),
        v.literal("Transports"),
        v.null()
      )
    ),
    industrySubsector: v.optional(
      v.union(
        v.literal("Business Services"),
        v.literal("Financial Services"),
        v.literal("Construction & Materials"),
        v.literal("Food & Beverages"),
        v.literal("Others"),
        v.null()
      )
    ),
    sales: v.optional(
      v.union(
        v.literal("0-5"),
        v.literal("5-10"),
        v.literal("10-15"),
        v.literal("20-30"),
        v.literal("30+"),
        v.null()
      )
    ),
    ebitda: v.optional(
      v.union(
        v.literal("1-2"),
        v.literal("2-3"),
        v.literal("3-5"),
        v.literal("5+"),
        v.null()
      )
    ),
    ebitdaNormalized: v.optional(v.union(v.number(), v.null())),
    netDebt: v.optional(v.union(v.number(), v.null())),
    description: v.optional(v.union(v.null(), v.string())),
    graphRows: v.optional(
      v.union(
        v.array(
          v.object({
            year: v.string(),
            revenue: v.number(),
            ebitda: v.number(),
            ebitdaMargin: v.number(),
          })
        ),
        v.null()
      )
    ),
    salesCAGR: v.optional(v.union(v.number(), v.null())),
    ebitdaCAGR: v.optional(v.union(v.number(), v.null())),
    assetIncluded: v.optional(v.union(v.boolean(), v.null())),
    estimatedAssetValue: v.optional(v.union(v.number(), v.null())),
    preNDANotes: v.optional(v.union(v.null(), v.string())),

    // Post-NDA Fields
    shareholderStructure: v.optional(
      v.union(v.null(), v.array(v.id("_storage")))
    ),
    im: v.optional(v.union(v.null(), v.string())),
    entrepriseValue: v.optional(v.union(v.number(), v.null())),
    equityValue: v.optional(v.union(v.number(), v.null())),
    evDashEbitdaEntry: v.optional(v.union(v.number(), v.null())),
    evDashEbitdaExit: v.optional(v.union(v.number(), v.null())),
    ebitdaMargin: v.optional(v.union(v.number(), v.null())),
    fcf: v.optional(v.union(v.number(), v.null())),
    netDebtDashEbitda: v.optional(v.union(v.number(), v.null())),
    capexItensity: v.optional(v.union(v.number(), v.null())),
    workingCapitalNeeds: v.optional(v.union(v.number(), v.null())),
    postNDANotes: v.optional(v.union(v.null(), v.string())),

    // Co-Investment Fields
    coInvestment: v.optional(v.union(v.boolean(), v.null())),
    equityContribution: v.optional(v.union(v.number(), v.null())),
    grossIRR: v.optional(v.union(v.number(), v.null())),
    netIRR: v.optional(v.union(v.number(), v.null())),
    moic: v.optional(v.union(v.number(), v.null())),
    cashOnCashReturn: v.optional(v.union(v.number(), v.null())),
    cashConvertion: v.optional(v.union(v.number(), v.null())),
    entryMultiple: v.optional(v.union(v.number(), v.null())),
    exitExpectedMultiple: v.optional(v.union(v.number(), v.null())),
    holdPeriod: v.optional(v.union(v.number(), v.null())),
  },
  returns: v.id("mergersAndAcquisitions"),
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

    return await ctx.db.insert("mergersAndAcquisitions", {
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

    let opportunities: PaginationResult<Doc<"mergersAndAcquisitions">>;

    if (args.name) {
      opportunities = await ctx.db
        .query("mergersAndAcquisitions")
        .withSearchIndex("search_name", (q) =>
          q.search("name", args.name ?? "")
        )
        .paginate(args.paginationOpts);
    } else {
      opportunities = await ctx.db
        .query("mergersAndAcquisitions")
        .order("desc")
        .paginate(args.paginationOpts);
    }

    const enrichedOpportunities = await Promise.all(
      opportunities.page.map(async (opportunity) => {
        const user = await authComponent.getAnyUserById(
          ctx,
          opportunity.createdBy
        );

        const imagesUrls = opportunity.images
          ? await Promise.all(
              opportunity.images.map(
                async (image) => await ctx.storage.getUrl(image)
              )
            )
          : undefined;

        const shareholderStructureUrls = opportunity.shareholderStructure
          ? await Promise.all(
              opportunity.shareholderStructure.map(
                async (image) => await ctx.storage.getUrl(image)
              )
            )
          : undefined;

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
          imagesUrls,
          shareholderStructureUrls,
        };
      })
    );

    return {
      ...opportunities,
      page: enrichedOpportunities,
    };
  },
});

export const getById = query({
  args: {
    id: v.id("mergersAndAcquisitions"),
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
          opportunity.images.map(
            async (image) => await ctx.storage.getUrl(image)
          )
        )
      : undefined;

    const shareholderStructureUrls = opportunity.shareholderStructure
      ? await Promise.all(
          opportunity.shareholderStructure.map(
            async (image) => await ctx.storage.getUrl(image)
          )
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
      shareholderStructureUrls,
    };
  },
});

export const update = mutation({
  args: {
    id: v.id("mergersAndAcquisitions"),
    name: v.optional(v.string()),
    images: v.optional(v.union(v.null(), v.array(v.id("_storage")))),
    type: v.optional(
      v.union(
        v.literal("Buy In"),
        v.literal("Buy Out"),
        v.literal("Buy In/Buy Out"),
        v.null()
      )
    ),
    typeDetails: v.optional(
      v.union(
        v.literal("Maioritário"),
        v.literal("Minoritário"),
        v.literal("100%"),
        v.null()
      )
    ),
    industry: v.optional(
      v.union(
        v.literal("Services"),
        v.literal("Transformation Industry"),
        v.literal("Trading"),
        v.literal("Energy & Infrastructure"),
        v.literal("Fitness"),
        v.literal("Healthcare & Pharmaceuticals"),
        v.literal("IT"),
        v.literal("TMT (Technology, Media & Telecom)"),
        v.literal("Transports"),
        v.null()
      )
    ),
    industrySubsector: v.optional(
      v.union(
        v.literal("Business Services"),
        v.literal("Financial Services"),
        v.literal("Construction & Materials"),
        v.literal("Food & Beverages"),
        v.literal("Others"),
        v.null()
      )
    ),
    sales: v.optional(
      v.union(
        v.literal("0-5"),
        v.literal("5-10"),
        v.literal("10-15"),
        v.literal("20-30"),
        v.literal("30+"),
        v.null()
      )
    ),
    ebitda: v.optional(
      v.union(
        v.literal("1-2"),
        v.literal("2-3"),
        v.literal("3-5"),
        v.literal("5+"),
        v.null()
      )
    ),
    ebitdaNormalized: v.optional(v.union(v.number(), v.null())),
    netDebt: v.optional(v.union(v.number(), v.null())),
    description: v.optional(v.union(v.null(), v.string())),
    graphRows: v.optional(
      v.union(
        v.array(
          v.object({
            year: v.string(),
            revenue: v.number(),
            ebitda: v.number(),
            ebitdaMargin: v.number(),
          })
        ),
        v.null()
      )
    ),
    salesCAGR: v.optional(v.union(v.number(), v.null())),
    ebitdaCAGR: v.optional(v.union(v.number(), v.null())),
    assetIncluded: v.optional(v.union(v.boolean(), v.null())),
    estimatedAssetValue: v.optional(v.union(v.number(), v.null())),
    preNDANotes: v.optional(v.union(v.null(), v.string())),

    // Post-NDA Fields
    shareholderStructure: v.optional(
      v.union(v.null(), v.array(v.id("_storage")))
    ),
    im: v.optional(v.union(v.null(), v.string())),
    entrepriseValue: v.optional(v.union(v.number(), v.null())),
    equityValue: v.optional(v.union(v.number(), v.null())),
    evDashEbitdaEntry: v.optional(v.union(v.number(), v.null())),
    evDashEbitdaExit: v.optional(v.union(v.number(), v.null())),
    ebitdaMargin: v.optional(v.union(v.number(), v.null())),
    fcf: v.optional(v.union(v.number(), v.null())),
    netDebtDashEbitda: v.optional(v.union(v.number(), v.null())),
    capexItensity: v.optional(v.union(v.number(), v.null())),
    workingCapitalNeeds: v.optional(v.union(v.number(), v.null())),
    postNDANotes: v.optional(v.union(v.null(), v.string())),

    // Co-Investment Fields
    coInvestment: v.optional(v.union(v.boolean(), v.null())),
    equityContribution: v.optional(v.union(v.number(), v.null())),
    grossIRR: v.optional(v.union(v.number(), v.null())),
    netIRR: v.optional(v.union(v.number(), v.null())),
    moic: v.optional(v.union(v.number(), v.null())),
    cashOnCashReturn: v.optional(v.union(v.number(), v.null())),
    cashConvertion: v.optional(v.union(v.number(), v.null())),
    entryMultiple: v.optional(v.union(v.number(), v.null())),
    exitExpectedMultiple: v.optional(v.union(v.number(), v.null())),
    holdPeriod: v.optional(v.union(v.number(), v.null())),
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

    const { id, ...updateData } = args;

    return await ctx.db.patch(id, {
      ...updateData,
    });
  },
});
