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
    role: v.optional(v.string()), // [user, admin]
  }).index("email", ["email"]),

  opportunitiesMergersAndAcquisitions: defineTable({
    name: v.string(), // Max 100 characters
    description: v.optional(v.string()), // Max 500 characters
    images: v.optional(v.array(v.id("_storage"))), // Max 10 images per opportunity
    sales: v.union(
      v.literal("0-5"),
      v.literal("5-10"),
      v.literal("10-15"),
      v.literal("20-30"),
      v.literal("30+"),
    ), // In millions, Ranges [0-5, 5-10, 10-15, 20-30, 30+]
    ebitda: v.union(
      v.literal("1-2"),
      v.literal("2-3"),
      v.literal("3-5"),
      v.literal("5+"),
    ), // In millions, Ranges [1-2, 2-3, 3-5, 5+]
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
    ), // [Services, Transformation Industry, Trading, Energy & Infrastructure, Fitness, Healthcare & Pharmaceuticals, IT, TMT (Technology, Media & Telecommunications), Transports]
    subIndustry: v.optional(v.string()), // In case of Services, Transformation Industry or Trading we can have sub industries
    type: v.union(v.literal("Buy In"), v.literal("Buy Out")), // [Buy In, Buy Out]
    typeDetails: v.union(
      v.literal("Majority"),
      v.literal("Minority"),
      v.literal("Full"),
    ), // [Majority, Minority, Full]
    status: v.union(
      v.literal("No Interest"),
      v.literal("Interested"),
      v.literal("Completed"),
    ), // [No Interest, Interested, Completed]
  }),
});

export default schema;
