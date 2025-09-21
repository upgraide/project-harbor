import { z } from "zod";

export const createMergersAndAcquisitionsFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(100, { message: "Name must be at most 100 characters long" }),
  images: z.array(z.string()).optional(),
  type: z.enum(["Buy In", "Buy Out", "Buy In/Buy Out"]).optional(),
  typeDetails: z.enum(["Maioritário", "Minoritário", "100%"]).optional(),
  industry: z
    .enum([
      "Services",
      "Transformation Industry",
      "Trading",
      "Energy & Infrastructure",
      "Fitness",
      "Healthcare & Pharmaceuticals",
      "IT",
      "TMT (Technology, Media & Telecom)",
      "Transports",
    ])
    .optional(),
  industrySubsector: z
    .enum([
      "Business Services",
      "Financial Services",
      "Construction & Materials",
      "Food & Beverages",
      "Others",
    ])
    .optional(),
  sales: z.enum(["0-5", "5-10", "10-15", "20-30", "30+"]).optional(),
  ebitda: z.enum(["1-2", "2-3", "3-5", "5+"]).optional(),
  ebitdaNormalized: z.number().optional(),
  netDebt: z.number().optional(),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" })
    .max(1000, { message: "Description must be at most 1000 characters long" })
    .optional(),
  graphRows: z
    .array(
      z.object({ year: z.number(), revenue: z.number(), ebitda: z.number() }),
    )
    .optional(),
  salesCAGR: z.number().optional(),
  ebitdaCAGR: z.number().optional(),
  assetIncluded: z.boolean().optional(),
  estimatedAssetValue: z.number().optional(),
});

export type CreateMergersAndAcquisitionsFormSchemaType = z.infer<
  typeof createMergersAndAcquisitionsFormSchema
>;
