import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  mergersAndAcquisitions: defineTable({
    name: v.string(),
    images: v.optional(v.union(v.null(), v.array(v.id("_storage")))),
    type: v.optional(
      v.union(
        v.literal("Buy In"),
        v.literal("Buy Out"),
        v.literal("Buy In/Buy Out"),
        v.null(),
      ),
    ),
    typeDetails: v.optional(
      v.union(
        v.literal("Maioritário"),
        v.literal("Minoritário"),
        v.literal("100%"),
        v.null(),
      ),
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
        v.null(),
      ),
    ),
    industrySubsector: v.optional(
      v.union(
        v.literal("Business Services"),
        v.literal("Financial Services"),
        v.literal("Construction & Materials"),
        v.literal("Food & Beverages"),
        v.literal("Others"),
        v.null(),
      ),
    ),
    sales: v.optional(
      v.union(
        v.literal("0-5"),
        v.literal("5-10"),
        v.literal("10-15"),
        v.literal("20-30"),
        v.literal("30+"),
        v.null(),
      ),
    ),
    ebitda: v.optional(
      v.union(
        v.literal("1-2"),
        v.literal("2-3"),
        v.literal("3-5"),
        v.literal("5+"),
        v.null(),
      ),
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
          }),
        ),
        v.null(),
      ),
    ),
    salesCAGR: v.optional(v.union(v.number(), v.null())),
    ebitdaCAGR: v.optional(v.union(v.number(), v.null())),
    assetIncluded: v.optional(v.union(v.boolean(), v.null())),
    estimatedAssetValue: v.optional(v.union(v.number(), v.null())),

    // Post-NDA Fields
    shareholderStructure: v.optional(v.union(v.null(), v.id("_storage"))),
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

    createdBy: v.string(),
  }).searchIndex("search_name", {
    searchField: "name",
  }),
});

export default schema;
