import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { authComponent } from "./auth";
import { paginationOptsValidator } from "convex/server";

export const getMany = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }

    const maOpportunities = await ctx.db
      .query("mergersAndAcquisitions")
      .order("desc")
      .paginate(args.paginationOpts);

    const reOpportunities = await ctx.db
      .query("realEstates")
      .order("desc")
      .collect();

    const allOpportunities = [
      ...maOpportunities.page.map((opp) => ({
        ...opp,
        type: "mergersAndAcquisitions" as const,
      })),
      ...reOpportunities.map((opp) => ({
        ...opp,
        type: "realEstates" as const,
      })),
    ].sort((a, b) => b._creationTime - a._creationTime);

    // Enrich the opportunities
    const enrichedOpportunities = await Promise.all(
      allOpportunities.map(async (opportunity) => {
        const user = await authComponent.getAnyUserById(
          ctx,
          opportunity.createdBy,
        );

        const imagesUrls = opportunity.images
          ? await Promise.all(
              opportunity.images.map(async (image) => {
                return await ctx.storage.getUrl(image);
              }),
            )
          : undefined;

        const shareholderStructureUrls =
          opportunity.type === "mergersAndAcquisitions" &&
          opportunity.shareholderStructure
            ? await Promise.all(
                opportunity.shareholderStructure.map(async (image) => {
                  return await ctx.storage.getUrl(image);
                }),
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
          ...(opportunity.type === "mergersAndAcquisitions" && {
            shareholderStructureUrls,
          }),
        };
      }),
    );

    return {
      page: enrichedOpportunities,
      isDone: maOpportunities.isDone,
      continueCursor: maOpportunities.continueCursor,
    };
  },
});
