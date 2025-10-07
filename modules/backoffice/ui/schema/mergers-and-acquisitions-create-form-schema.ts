import { z } from "zod";
import type { Id } from "@/convex/_generated/dataModel";

const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 100;
const DESCRIPTION_MIN_LENGTH = 3;
const DESCRIPTION_MAX_LENGTH = 1000;

export const createMergersAndAcquisitionsFormSchema = z.object({
  name: z
    .string()
    .min(NAME_MIN_LENGTH, {
      message: `Name must be at least ${NAME_MIN_LENGTH} characters long`,
    })
    .max(NAME_MAX_LENGTH, {
      message: `Name must be at most ${NAME_MAX_LENGTH} characters long`,
    }),
  images: z.array(z.custom<Id<"_storage">>()).optional(),
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
  ebitdaNormalized: z
    .number()
    .min(0, { message: "EBITDA Normalized must be greater than 0" })
    .optional(),
  netDebt: z
    .number()
    .min(0, { message: "Net Debt must be greater than 0" })
    .optional(),
  description: z
    .string()
    .min(DESCRIPTION_MIN_LENGTH, {
      message: `Description must be at least ${DESCRIPTION_MIN_LENGTH} characters long`,
    })
    .max(DESCRIPTION_MAX_LENGTH, {
      message: `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters long`,
    })
    .optional(),
  preNDANotes: z
    .string()
    .min(DESCRIPTION_MIN_LENGTH, {
      message: `Pre NDA Notes must be at least ${DESCRIPTION_MIN_LENGTH} characters long`,
    })
    .max(DESCRIPTION_MAX_LENGTH, {
      message: `Pre NDA Notes must be at most ${DESCRIPTION_MAX_LENGTH} characters long`,
    })
    .optional(),
  postNDANotes: z
    .string()
    .min(DESCRIPTION_MIN_LENGTH, {
      message: `Post NDA Notes must be at least ${DESCRIPTION_MIN_LENGTH} characters long`,
    })
    .max(DESCRIPTION_MAX_LENGTH, {
      message: `Post NDA Notes must be at most ${DESCRIPTION_MAX_LENGTH} characters long`,
    })
    .optional(),
  graphRows: z
    .array(
      z.object({ year: z.string(), revenue: z.number(), ebitda: z.number() })
    )
    .optional(),
  salesCAGR: z
    .number()
    .min(0, { message: "Sales CAGR must be greater than 0" })
    .optional(),
  ebitdaCAGR: z
    .number()
    .min(0, { message: "EBITDA CAGR must be greater than 0" })
    .optional(),
  assetIncluded: z.boolean().optional(),
  estimatedAssetValue: z
    .number()
    .min(0, { message: "Estimated Asset Value must be greater than 0" })
    .optional(),
  shareholderStructure: z.array(z.custom<Id<"_storage">>()).optional(),
  im: z.string().optional(),
  entrepriseValue: z
    .number()
    .min(0, { message: "Entreprise Value must be greater than 0" })
    .optional(),
  equityValue: z
    .number()
    .min(0, { message: "Equity Value must be greater than 0" })
    .optional(),
  evDashEbitdaEntry: z
    .number()
    .min(0, { message: "EV/EBITDA (Entry) must be greater than 0" })
    .optional(),
  evDashEbitdaExit: z
    .number()
    .min(0, { message: "EV/EBITDA (Exit/Comps) must be greater than 0" })
    .optional(),
  ebitdaMargin: z
    .number()
    .min(0, { message: "EBITDA Margin must be greater than 0" })
    .optional(),
  fcf: z
    .number()
    .min(0, { message: "Free Cash Flow must be greater than 0" })
    .optional(),
  netDebtDashEbitda: z
    .number()
    .min(0, { message: "Net Debt/EBITDA must be greater than 0" })
    .optional(),
  capexItensity: z
    .number()
    .min(0, { message: "Capex Intensity must be greater than 0" })
    .optional(),
  workingCapitalNeeds: z
    .number()
    .min(0, { message: "Working Capital Needs must be greater than 0" })
    .optional(),
  coInvestment: z.boolean().optional(),
  equityContribution: z
    .number()
    .min(0, { message: "Equity Contribution must be greater than 0" })
    .optional(),
  grossIRR: z
    .number()
    .min(0, { message: "Gross IRR must be greater than 0" })
    .optional(),
  netIRR: z
    .number()
    .min(0, { message: "Net IRR must be greater than 0" })
    .optional(),
  moic: z
    .number()
    .min(0, { message: "MOIC must be greater than 0" })
    .optional(),
  cashOnCashReturn: z
    .number()
    .min(0, { message: "Cash On Cash Return must be greater than 0" })
    .optional(),
  cashConvertion: z
    .number()
    .min(0, { message: "Cash Convertion must be greater than 0" })
    .optional(),
  entryMultiple: z
    .number()
    .min(0, { message: "Entry Multiple must be greater than 0" })
    .optional(),
  exitExpectedMultiple: z
    .number()
    .min(0, { message: "Exit Expected Multiple must be greater than 0" })
    .optional(),
  holdPeriod: z
    .number()
    .min(0, { message: "Hold Period must be greater than 0" })
    .optional(),
});

export type CreateMergersAndAcquisitionsFormSchemaType = z.infer<
  typeof createMergersAndAcquisitionsFormSchema
>;
