import { z } from "zod";
import type { Id } from "@/convex/_generated/dataModel";

const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 100;
const DESCRIPTION_MIN_LENGTH = 3;
const DESCRIPTION_MAX_LENGTH = 1000;
const LOCATION_MIN_LENGTH = 3;

export const realEstateCreateFormSchema = z.object({
  name: z
    .string()
    .min(NAME_MIN_LENGTH, {
      message: `Name must be at least ${NAME_MIN_LENGTH} characters long`,
    })
    .max(NAME_MAX_LENGTH, {
      message: `Name must be at most ${NAME_MAX_LENGTH} characters long`,
    }),
  description: z
    .string()
    .min(DESCRIPTION_MIN_LENGTH, {
      message: `Description must be at least ${DESCRIPTION_MIN_LENGTH} characters long`,
    })
    .max(DESCRIPTION_MAX_LENGTH, {
      message: `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters long`,
    })
    .optional(),
  asset: z
    .enum([
      "Agnostic",
      "Mixed",
      "Hospitality",
      "Logistics & Industrial",
      "Office",
      "Residential",
      "Senior Living",
      "Shopping Center",
      "Street Retail",
      "Student Housing",
    ])
    .optional(),
  nRoomsLastYear: z
    .number()
    .min(0, { message: "Number of rooms must be greater than 0" })
    .optional(),
  noi: z.number().min(0, { message: "NOI must be greater than 0" }).optional(),
  occupancyLastYear: z
    .number()
    .min(0, { message: "Occupancy must be greater than 0" })
    .optional(),
  walt: z.number().min(0, { message: "WAL must be greater than 0" }).optional(),
  nBeds: z
    .number()
    .min(0, { message: "Number of beds must be greater than 0" })
    .optional(),
  investment: z
    .enum([
      "Lease and Operation",
      "S&L",
      "Core",
      "Fix&Flip",
      "Refurbishment",
      "Value-add",
      "Opportunistic",
      "Development",
    ])
    .optional(),
  subRent: z
    .number()
    .min(0, { message: "Rent must be greater than 0" })
    .optional(),
  rentPerSqm: z
    .number()
    .min(0, { message: "Rent per square meter must be greater than 0" })
    .optional(),
  subYield: z
    .number()
    .min(0, { message: "Sub Yield must be greater than 0" })
    .optional(),
  capex: z
    .number()
    .min(0, { message: "CAPEX must be greater than 0" })
    .optional(),
  capexPerSqm: z
    .number()
    .min(0, { message: "CAPEX per square meter must be greater than 0" })
    .optional(),
  sale: z
    .number()
    .min(0, { message: "Sale must be greater than 0" })
    .optional(),
  salePerSqm: z
    .number()
    .min(0, { message: "Sale per square meter must be greater than 0" })
    .optional(),
  location: z
    .string()
    .min(LOCATION_MIN_LENGTH, {
      message: `Location must be at least ${LOCATION_MIN_LENGTH} characters long`,
    })
    .optional(),
  area: z
    .number()
    .min(0, { message: "Area must be greater than 0" })
    .optional(),
  value: z
    .number()
    .min(0, { message: "Value must be greater than 0" })
    .optional(),
  yield: z
    .number()
    .min(0, { message: "Yield must be greater than 0" })
    .optional(),
  rent: z
    .number()
    .min(0, { message: "Rent must be greater than 0" })
    .optional(),
  gcaAboveGround: z
    .number()
    .min(0, { message: "GCA Above Ground must be greater than 0" })
    .optional(),
  gcaBelowGround: z
    .number()
    .min(0, { message: "GCA Below Ground must be greater than 0" })
    .optional(),
  license: z.string().optional(),
  irr: z.number().min(0, { message: "IRR must be greater than 0" }).optional(),
  coc: z.number().min(0, { message: "COC must be greater than 0" }).optional(),
  licenseStage: z.string().optional(),
  holdingPeriod: z
    .number()
    .min(0, { message: "Holding Period must be greater than 0" })
    .optional(),
  breakEvenOccupancy: z
    .number()
    .min(0, { message: "Break Even Occupancy must be greater than 0" })
    .optional(),
  vacancyRate: z.number().optional(),
  estimatedRentValue: z
    .number()
    .min(0, { message: "Estimated Rent Value must be greater than 0" })
    .optional(),
  occupancyRate: z
    .number()
    .min(0, { message: "Occupancy Rate must be greater than 0" })
    .optional(),
  moic: z
    .number()
    .min(0, { message: "MOIC must be greater than 0" })
    .optional(),
  price: z
    .number()
    .min(0, { message: "Price must be greater than 0" })
    .optional(),
  totalInvestment: z
    .number()
    .min(0, { message: "Total Investment must be greater than 0" })
    .optional(),
  profitOnCost: z
    .number()
    .min(0, { message: "Profit On Cost must be greater than 0" })
    .optional(),
  profit: z
    .number()
    .min(0, { message: "Profit must be greater than 0" })
    .optional(),
  sofCosts: z
    .number()
    .min(0, { message: "SOF Costs must be greater than 0" })
    .optional(),
  sellPerSqm: z
    .number()
    .min(0, { message: "Sell Per Square Meter must be greater than 0" })
    .optional(),
  gdv: z.number().min(0, { message: "GDV must be greater than 0" }).optional(),
  wault: z
    .number()
    .min(0, { message: "WALT must be greater than 0" })
    .optional(),
  debtServiceCoverageRatio: z
    .number()
    .min(0, { message: "Debt Service Coverage Ratio must be greater than 0" })
    .optional(),
  expectedExitYield: z
    .number()
    .min(0, { message: "Expected Exit Yield must be greater than 0" })
    .optional(),
  ltv: z.number().min(0, { message: "LTV must be greater than 0" }).optional(),
  ltc: z.number().min(0, { message: "LTC must be greater than 0" }).optional(),
  yieldOnCost: z
    .number()
    .min(0, { message: "Yield On Cost must be greater than 0" })
    .optional(),
  coInvestment: z.boolean().optional(),
  gpEquityValue: z
    .number()
    .min(0, { message: "GP Equity Value must be greater than 0" })
    .optional(),
  gpEquencyPercentage: z
    .number()
    .min(0, { message: "GP Equity Percentage must be greater than 0" })
    .optional(),
  totalEquityRequired: z
    .number()
    .min(0, { message: "Total Equity Required must be greater than 0" })
    .optional(),
  sponsorPresentation: z.string().optional(),
  promoteStructure: z.string().optional(),
  projectIRR: z
    .number()
    .min(0, { message: "Project IRR must be greater than 0" })
    .optional(),
  investorIRR: z
    .number()
    .min(0, { message: "Investor IRR must be greater than 0" })
    .optional(),
  coInvestmentHoldPeriod: z
    .number()
    .min(0, { message: "Co-Investment Hold Period must be greater than 0" })
    .optional(),
  coInvestmentBreakEvenOccupancy: z
    .number()
    .min(0, {
      message: "Co-Investment Break Even Occupancy must be greater than 0",
    })
    .optional(),
  images: z.array(z.custom<Id<"_storage">>()).optional(),
});

export type CreateRealEstateFormSchemaType = z.infer<
  typeof realEstateCreateFormSchema
>;
