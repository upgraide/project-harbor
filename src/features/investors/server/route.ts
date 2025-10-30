import { z } from "zod";
import { PAGINATION } from "@/config/constants";
import { InvestorType, Role } from "@/generated/prisma";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const investorsRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        investorType: z
          .enum(["all", "<€10M", "€10M-€100M", ">€100M"])
          .default("all"),
        interestSegment: z.enum(["all", "CRE", "M&A"]).default("all"),
        industry: z.string().default("all"),
        search: z.string().default(""),
      })
    )
    .query(async ({ input }) => {
      const {
        page,
        pageSize,
        investorType,
        interestSegment,
        industry,
        search,
      } = input;

      const searchTerm = search.trim();
      const searchFilter = searchTerm
        ? {
            OR: [
              { name: { contains: searchTerm, mode: "insensitive" as const } },
              { email: { contains: searchTerm, mode: "insensitive" as const } },
            ],
          }
        : undefined;

      // Fetch all investors first (we'll filter and paginate after aggregating)
      const allUsers = await prisma.user.findMany({
        where: {
          role: Role.USER,
          ...searchFilter,
        },
        select: {
          id: true,
          name: true,
          email: true,
          investorType: true,
          preferredLocation: true,
          mergerAndAcquisitionInterests: {
            where: { interested: true },
            include: {
              mergerAndAcquisition: {
                select: {
                  industry: true,
                  industrySubsector: true,
                },
              },
            },
          },
          realEstateInterests: {
            where: { interested: true },
            include: {
              realEstate: {
                select: {
                  asset: true,
                  location: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Helper function to format investor type
      const formatInvestorType = (
        type: (typeof InvestorType)[keyof typeof InvestorType] | null
      ) => {
        if (!type) {
          return null;
        }
        if (type === InvestorType.LESS_THAN_10M) {
          return "<€10M";
        }
        if (type === InvestorType.BETWEEN_10M_100M) {
          return "€10M-€100M";
        }
        return ">€100M";
      };

      // Helper function to get segments
      const getSegments = (
        hasMAInterests: boolean,
        hasRealEstateInterests: boolean
      ) => {
        const segments: string[] = [];
        if (hasRealEstateInterests) {
          segments.push("CRE");
        }
        if (hasMAInterests) {
          segments.push("M&A");
        }
        return segments;
      };

      // Helper function to collect industries and subsectors
      const collectMAInterests = (
        interests: (typeof allUsers)[number]["mergerAndAcquisitionInterests"]
      ) => {
        const industries = new Set<string>();
        const subsectors = new Set<string>();
        for (const interest of interests) {
          if (interest.mergerAndAcquisition.industry) {
            industries.add(interest.mergerAndAcquisition.industry);
          }
          if (interest.mergerAndAcquisition.industrySubsector) {
            subsectors.add(interest.mergerAndAcquisition.industrySubsector);
          }
        }
        return { industries, subsectors };
      };

      // Helper function to collect asset types and locations
      const collectRealEstateInterests = (
        interests: (typeof allUsers)[number]["realEstateInterests"]
      ) => {
        const assetTypes = new Set<string>();
        const locations = new Set<string>();
        for (const interest of interests) {
          if (interest.realEstate.asset) {
            assetTypes.add(interest.realEstate.asset);
          }
          if (interest.realEstate.location) {
            locations.add(interest.realEstate.location);
          }
        }
        return { assetTypes, locations };
      };

      // Helper function to check filters
      const matchesFilters = (
        interestData: {
          segments: string[];
          industries: Set<string>;
          subsectors: Set<string>;
          assetTypes: Set<string>;
          locations: Set<string>;
          hasMAInterests: boolean;
          hasRealEstateInterests: boolean;
        },
        investorTypeDisplay: string | null,
        filters: {
          investorType: string;
          interestSegment: string;
          industry: string;
        }
      ) => {
        const shouldIncludeBySegment =
          filters.interestSegment === "all" ||
          (filters.interestSegment === "CRE" &&
            interestData.hasRealEstateInterests) ||
          (filters.interestSegment === "M&A" && interestData.hasMAInterests);

        const shouldIncludeByType =
          filters.investorType === "all" ||
          investorTypeDisplay === filters.investorType ||
          (filters.investorType !== "all" && !investorTypeDisplay);

        const industryLower = filters.industry.toLowerCase();
        const shouldIncludeByIndustry =
          filters.industry === "all" ||
          Array.from(interestData.industries).some((ind) =>
            ind.toLowerCase().includes(industryLower)
          ) ||
          Array.from(interestData.subsectors).some((sub) =>
            sub.toLowerCase().includes(industryLower)
          ) ||
          Array.from(interestData.assetTypes).some((asset) =>
            asset.toLowerCase().includes(industryLower)
          );

        return (
          shouldIncludeBySegment &&
          shouldIncludeByType &&
          shouldIncludeByIndustry
        );
      };

      // Format investors with aggregated data
      const formattedItems = allUsers.map((user) => {
        const hasMAInterests = user.mergerAndAcquisitionInterests.length > 0;
        const hasRealEstateInterests = user.realEstateInterests.length > 0;

        const segments = getSegments(hasMAInterests, hasRealEstateInterests);
        const { industries, subsectors } = collectMAInterests(
          user.mergerAndAcquisitionInterests
        );
        const { assetTypes, locations } = collectRealEstateInterests(
          user.realEstateInterests
        );

        const investorTypeDisplay = formatInvestorType(user.investorType);
        const preferredLocation =
          user.preferredLocation || Array.from(locations).join(", ") || "N/A";

        const shouldInclude = matchesFilters(
          {
            segments,
            industries,
            subsectors,
            assetTypes,
            locations,
            hasMAInterests,
            hasRealEstateInterests,
          },
          investorTypeDisplay,
          {
            investorType,
            interestSegment,
            industry,
          }
        );

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          investorType: investorTypeDisplay || "<€10M",
          interestSegments: segments,
          interestSubcategories: [
            ...Array.from(industries),
            ...Array.from(subsectors),
            ...Array.from(assetTypes),
          ],
          preferredLocation,
          hasMAInterests,
          hasRealEstateInterests,
          shouldIncludeBySegment: true,
          shouldIncludeByType: true,
          shouldIncludeByIndustry: true,
          shouldInclude,
        };
      });

      // Apply filters
      const filteredItems = formattedItems.filter((item) => item.shouldInclude);

      const totalCount = filteredItems.length;
      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      // Paginate filtered results
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedItems = filteredItems.slice(startIndex, endIndex);

      return {
        items: paginatedItems.map(
          ({
            shouldIncludeBySegment,
            shouldIncludeByType,
            shouldIncludeByIndustry,
            ...item
          }) => item
        ),
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
});
