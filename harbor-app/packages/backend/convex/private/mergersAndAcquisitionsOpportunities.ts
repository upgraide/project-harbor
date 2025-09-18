import { getAuthUserId } from "@convex-dev/auth/server";
import { type PaginationResult, paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import type { Doc, Id } from "../_generated/dataModel";
import { mutation, query } from "../_generated/server";

const MAX_IMAGES_VALUE = 10;

export const getMany = query({
  args: {
    paginationOpts: paginationOptsValidator,
    status: v.optional(
      v.union(
        v.literal("no-interest"),
        v.literal("interested"),
        v.literal("completed"),
      ),
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

    const enrichedOpportunities = await Promise.all(
      opportunities.page.map(async (opportunity) => {
        const createdBy = await ctx.db.get(opportunity.createdBy);
        return {
          ...opportunity,
          createdBy: createdBy
            ? {
                _id: createdBy._id,
                name: createdBy.name,
                email: createdBy.email,
                avatarURL: createdBy.imageId
                  ? await ctx.storage.getUrl(createdBy.imageId)
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

/**
 * Get a mergers and acquisitions opportunity by id
 *
 * This query returns all the information about the opportunity, including the createdBy user
 * Becarefull with data leakage, we don't want to return the full NDA information in user-facing queries
 *
 * Only works for users with the role of admin or team
 *
 * @param args.opportunityId - The id of the opportunity to get
 * @returns The opportunity with the createdBy user enriched
 */
export const getById = query({
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

    // TODO: Check if user is admin or team at least
    const opportunity = await ctx.db.get(args.opportunityId);

    if (!opportunity) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Opportunity not found",
      });
    }

    let images: string[] = [];

    if (opportunity.images) {
      images = (await Promise.all(
        (opportunity.images as Id<"_storage">[]).map(async (imageId) => {
          const url = await ctx.storage.getUrl(imageId);
          return url;
        }),
      )) as string[];
    }

    const createdBy = await ctx.db.get(opportunity.createdBy);

    const enrichedOpportunity = {
      ...opportunity,
      imagesURLs: images.filter((image): image is string => image !== null),
      createdBy: createdBy
        ? {
            _id: createdBy._id,
            name: createdBy.name,
            email: createdBy.email,
            avatarURL: createdBy.imageId
              ? (await ctx.storage.getUrl(createdBy.imageId)) || undefined
              : undefined,
          }
        : null,
    };

    return enrichedOpportunity;
  },
});

/**
 * Create a new M&A opportunity
 */
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    images: v.optional(v.array(v.id("_storage"))),
    sales: v.union(
      v.literal("0-5"),
      v.literal("5-10"),
      v.literal("10-15"),
      v.literal("20-30"),
      v.literal("30+"),
    ),
    ebitda: v.union(
      v.literal("1-2"),
      v.literal("2-3"),
      v.literal("3-5"),
      v.literal("5+"),
    ),
    ebitdaNormalized: v.optional(v.number()),
    netDebt: v.optional(v.number()),
    industry: v.union(
      v.literal("Services"),
      v.literal("Transformation Industry"),
      v.literal("Trading"),
      v.literal("Energy & Infrastructure"),
      v.literal("Fitness"),
      v.literal("Healthcare & Pharmaceuticals"),
      v.literal("IT"),
      v.literal("TMT (Technology, Media & Telecommunications)"),
      v.literal("Transports"),
    ),
    subIndustry: v.optional(v.string()),
    type: v.union(v.literal("Buy In"), v.literal("Buy Out")),
    typeDetails: v.union(
      v.literal("Majority"),
      v.literal("Minority"),
      v.literal("Full"),
    ),
    status: v.union(
      v.literal("no-interest"),
      v.literal("interested"),
      v.literal("completed"),
    ),
    graphRows: v.optional(
      v.array(
        v.object({
          year: v.number(),
          revenue: v.number(),
          ebitda: v.number(),
        }),
      ),
    ),
    assetIncluded: v.optional(v.boolean()),
    assetValue: v.optional(v.number()),
    salesCAGR: v.optional(v.number()),
    ebitdaCAGR: v.optional(v.number()),
    entrepriveValue: v.optional(v.number()),
    equityValue: v.optional(v.number()),
    evDashEbitdaEntry: v.optional(v.number()),
    evDashEbitdaExit: v.optional(v.number()),
    ebitdaMargin: v.optional(v.number()),
    freeCashFlow: v.optional(v.number()),
    netDebtDashEbitda: v.optional(v.number()),
    capexIntensity: v.optional(v.number()),
    workingCapitalNeeds: v.optional(v.number()),
  },
  returns: v.id("opportunitiesMergersAndAcquisitions"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    // TODO: Check if user is admin or team at least

    return await ctx.db.insert("opportunitiesMergersAndAcquisitions", {
      ...args,
      createdBy: userId,
    });
  },
});

/**
 * Add an image to a mergers and acquisitions opportunity
 *
 * @param args.opportunityId - The id of the opportunity to add the image to
 * @param args.imageId - The id of the image to add to the opportunity
 * @returns void
 */
export const addImage = mutation({
  args: {
    opportunityId: v.id("opportunitiesMergersAndAcquisitions"),
    imageId: v.id("_storage"),
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
    const opportunity = await ctx.db.get(args.opportunityId);

    if (!opportunity) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Opportunity not found",
      });
    }

    if (opportunity.images?.length === MAX_IMAGES_VALUE) {
      await ctx.storage.delete(args.imageId);

      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Maximum number of images reached",
      });
    }

    // Here we assert that the opportunity.images is not null
    const updatedImages = [...(opportunity.images || []), args.imageId];

    await ctx.db.patch(args.opportunityId, {
      images: updatedImages,
    });

    return;
  },
});

/**
 * Update the description of a mergers and acquisitions opportunity
 *
 * @param args.opportunityId - The id of the opportunity to update
 * @param args.description - The new description for the opportunity
 * @returns void
 */
export const updateDescription = mutation({
  args: {
    opportunityId: v.id("opportunitiesMergersAndAcquisitions"),
    description: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    // TODO: Check if user is admin or team at least
    const opportunity = await ctx.db.get(args.opportunityId);

    if (!opportunity) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Opportunity not found",
      });
    }

    await ctx.db.patch(args.opportunityId, {
      description: args.description,
    });

    return null;
  },
});

/**
 * Add a graph row to a mergers and acquisitions opportunity
 *
 * @param args.opportunityId - The id of the opportunity to add the graph row to
 * @param args.year - The year for the graph row
 * @param args.revenue - The revenue for the year
 * @param args.ebitda - The EBITDA for the year
 * @returns void
 */
export const addGraphRow = mutation({
  args: {
    opportunityId: v.id("opportunitiesMergersAndAcquisitions"),
    year: v.number(),
    revenue: v.number(),
    ebitda: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    // TODO: Check if user is admin or team at least
    const opportunity = await ctx.db.get(args.opportunityId);

    if (!opportunity) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Opportunity not found",
      });
    }

    // Check if year already exists
    const existingRows = opportunity.graphRows || [];
    const yearExists = existingRows.some((row) => row.year === args.year);

    if (yearExists) {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Year already exists in the graph data",
      });
    }

    const newGraphRow = {
      year: args.year,
      revenue: args.revenue,
      ebitda: args.ebitda,
    };

    const updatedGraphRows = [...existingRows, newGraphRow].sort(
      (a, b) => a.year - b.year,
    );

    await ctx.db.patch(args.opportunityId, {
      graphRows: updatedGraphRows,
    });

    return null;
  },
});

/**
 * Update a graph row in a mergers and acquisitions opportunity
 *
 * @param args.opportunityId - The id of the opportunity to update the graph row in
 * @param args.oldYear - The current year of the row to update
 * @param args.newYear - The new year for the graph row
 * @param args.revenue - The new revenue for the year
 * @param args.ebitda - The new EBITDA for the year
 * @returns void
 */
export const updateGraphRow = mutation({
  args: {
    opportunityId: v.id("opportunitiesMergersAndAcquisitions"),
    oldYear: v.number(),
    newYear: v.number(),
    revenue: v.number(),
    ebitda: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    // TODO: Check if user is admin or team at least
    const opportunity = await ctx.db.get(args.opportunityId);

    if (!opportunity) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Opportunity not found",
      });
    }

    const existingRows = opportunity.graphRows || [];
    
    // Check if the old year exists
    const oldRowIndex = existingRows.findIndex((row) => row.year === args.oldYear);
    if (oldRowIndex === -1) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Graph row not found",
      });
    }

    // Check if new year already exists (and it's not the same as old year)
    if (args.newYear !== args.oldYear) {
      const yearExists = existingRows.some((row) => row.year === args.newYear);
      if (yearExists) {
        throw new ConvexError({
          code: "BAD_REQUEST",
          message: "Year already exists in the graph data",
        });
      }
    }

    // Update the row
    const updatedRows = [...existingRows];
    updatedRows[oldRowIndex] = {
      year: args.newYear,
      revenue: args.revenue,
      ebitda: args.ebitda,
    };

    // Sort by year
    const sortedRows = updatedRows.sort((a, b) => a.year - b.year);

    await ctx.db.patch(args.opportunityId, {
      graphRows: sortedRows,
    });

    return null;
  },
});

/**
 * Delete a graph row from a mergers and acquisitions opportunity
 *
 * @param args.opportunityId - The id of the opportunity to delete the graph row from
 * @param args.year - The year of the row to delete
 * @returns void
 */
export const deleteGraphRow = mutation({
  args: {
    opportunityId: v.id("opportunitiesMergersAndAcquisitions"),
    year: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    // TODO: Check if user is admin or team at least
    const opportunity = await ctx.db.get(args.opportunityId);

    if (!opportunity) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Opportunity not found",
      });
    }

    const existingRows = opportunity.graphRows || [];
    const filteredRows = existingRows.filter((row) => row.year !== args.year);

    if (filteredRows.length === existingRows.length) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Graph row not found",
      });
    }

    await ctx.db.patch(args.opportunityId, {
      graphRows: filteredRows,
    });

    return null;
  },
});

/**
 * Update a specific field in a mergers and acquisitions opportunity
 *
 * @param args.opportunityId - The id of the opportunity to update
 * @param args.field - The field name to update
 * @param args.value - The new value for the field
 * @returns void
 */
export const updateOpportunityField = mutation({
  args: {
    opportunityId: v.id("opportunitiesMergersAndAcquisitions"),
    field: v.string(),
    value: v.any(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    // TODO: Check if user is admin or team at least
    const opportunity = await ctx.db.get(args.opportunityId);

    if (!opportunity) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Opportunity not found",
      });
    }

    // Validate field name to prevent arbitrary field updates
    const allowedFields = [
      "type",
      "typeDetails", 
      "industry",
      "subIndustry",
      "sales",
      "ebitda",
      "ebitdaNormalized",
      "netDebt",
      "salesCAGR",
      "ebitdaCAGR",
      "assetIncluded",
      "assetValue",
      "entrepriveValue",
      "equityValue",
      "evDashEbitdaEntry",
      "evDashEbitdaExit",
      "ebitdaMargin",
      "freeCashFlow",
      "netDebtDashEbitda",
      "capexIntensity",
      "workingCapitalNeeds",
    ];

    if (!allowedFields.includes(args.field)) {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Invalid field name",
      });
    }

    // Handle null values for optional fields - convert to undefined
    const value = args.value === null ? undefined : args.value;
    
    await ctx.db.patch(args.opportunityId, {
      [args.field]: value,
    });

    return null;
  },
});
