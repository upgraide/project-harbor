import { z } from "zod";

export const realEstateCreateFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(100, { message: "Name must be at most 100 characters long" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" })
    .max(1000, { message: "Description must be at most 1000 characters long" })
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
    .min(3, { message: "Location must be at least 3 characters long" })
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
});

export type CreateRealEstateFormSchemaType = z.infer<
  typeof realEstateCreateFormSchema
>;
