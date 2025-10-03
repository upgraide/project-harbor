import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    company: v.string(),
    phone: v.string(),
    position: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => await ctx.db.insert("requestAccess", args),
});

export const find = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) =>
    await ctx.db
      .query("requestAccess")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique(),
});
