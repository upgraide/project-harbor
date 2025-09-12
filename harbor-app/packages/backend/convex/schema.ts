import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),

    // Custom fields.
    imageId: v.optional(v.id("_storage")),
  }).index("email", ["email"]),

  opportunitiesMergersAndAcquisitions: defineTable({
    name: v.string(), // Max 100 characters
    description: v.optional(v.string()), // Max 500 characters
    images: v.optional(v.array(v.id("_storage"))), // Max 10 images per opportunity
    sales: v.optional(v.string()), // In millions, Ranges [0-5, 5-10, 10-15, 20-30, 30+]
    ebitda: v.optional(v.string()), // In millions, Ranges [1-2, 2-3, 3-5, 5+]
    industry: v.optional(v.string()), // [Services, Transformation Industry, Trading, Energy & Infrastructure, Fitness, Healthcare & Pharmaceuticals, IT, TMT (Technology, Media & Telecommunications), Transports]
    subIndustry: v.optional(v.string()), // In case of Services, Transformation Industry or Trading we can have sub industries
    type: v.optional(v.string()), // [Buy In, Buy Out]
    typeDetails: v.optional(v.string()), // [Majority, Minority, Full]
  }),
});

export default schema;
