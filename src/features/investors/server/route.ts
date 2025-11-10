import { z } from "zod";
import { PAGINATION } from "@/config/constants";
import {
  Department,
  InvestorClientType,
  InvestorSegment,
  InvestorStrategy,
  InvestorType,
  Role,
  TeamMember,
} from "@/generated/prisma";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { sendInviteEmail } from "@/lib/emails/send-invite";
import { generatePassword } from "@/lib/generate-password";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";

// Helper function to map investor type string to enum
const mapInvestorTypeToEnum = (
  investorType: "<€10M" | "€10M-€100M" | ">€100M" | undefined
): InvestorType | null => {
  if (investorType === "<€10M") {
    return InvestorType.LESS_THAN_10M;
  }
  if (investorType === "€10M-€100M") {
    return InvestorType.BETWEEN_10M_100M;
  }
  if (investorType === ">€100M") {
    return InvestorType.GREATER_THAN_100M;
  }
  return null;
};

// Helper function to validate lead user
const validateLeadUser = async (
  userId: string | null | undefined,
  fieldName: string
): Promise<void> => {
  if (!userId) {
    return;
  }
  const leadUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (
    !leadUser ||
    (leadUser.role !== Role.TEAM && leadUser.role !== Role.ADMIN)
  ) {
    throw new Error(`${fieldName} must be a TEAM or ADMIN user`);
  }
};

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
          companyName: true,
          representativeName: true,
          phoneNumber: true,
          type: true,
          strategy1: true,
          segment1: true,
          strategy2: true,
          segment2: true,
          strategy3: true,
          segment3: true,
          location1: true,
          location2: true,
          location3: true,
          minTicketSize: true,
          maxTicketSize: true,
          targetReturnIRR: true,
          leadResponsibleId: true,
          leadMainContactId: true,
          leadResponsibleTeam: true,
          leadMainContactTeam: true,
          physicalAddress: true,
          website: true,
          lastContactDate: true,
          acceptMarketingList: true,
          otherFacts: true,
          lastNotes: true,
          department: true,
          leadResponsible: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          leadMainContact: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
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
          companyName: user.companyName,
          representativeName: user.representativeName,
          phoneNumber: user.phoneNumber,
          type: user.type,
          strategy1: user.strategy1,
          segment1: user.segment1,
          strategy2: user.strategy2,
          segment2: user.segment2,
          strategy3: user.strategy3,
          segment3: user.segment3,
          location1: user.location1,
          location2: user.location2,
          location3: user.location3,
          minTicketSize: user.minTicketSize,
          maxTicketSize: user.maxTicketSize,
          targetReturnIRR: user.targetReturnIRR,
          leadResponsibleId: user.leadResponsibleId,
          leadMainContactId: user.leadMainContactId,
          leadResponsible: user.leadResponsible,
          leadMainContact: user.leadMainContact,
          leadResponsibleTeam: user.leadResponsibleTeam,
          leadMainContactTeam: user.leadMainContactTeam,
          physicalAddress: user.physicalAddress,
          website: user.website,
          lastContactDate: user.lastContactDate,
          acceptMarketingList: user.acceptMarketingList,
          otherFacts: user.otherFacts,
          lastNotes: user.lastNotes,
          department: user.department,
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

  invite: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().min(1),
        language: z.enum(["en", "pt"]),
        investorType: z.enum(["<€10M", "€10M-€100M", ">€100M"]).optional(),
        preferredLocation: z.string().optional(),
        companyName: z.string().optional(),
        representativeName: z.string().optional(),
        phoneNumber: z.string().optional(),
        type: z.nativeEnum(InvestorClientType).optional(),
        strategy1: z.nativeEnum(InvestorStrategy).optional(),
        segment1: z.nativeEnum(InvestorSegment).optional(),
        strategy2: z.nativeEnum(InvestorStrategy).optional(),
        segment2: z.nativeEnum(InvestorSegment).optional(),
        strategy3: z.nativeEnum(InvestorStrategy).optional(),
        segment3: z.nativeEnum(InvestorSegment).optional(),
        location1: z.string().optional(),
        location2: z.string().optional(),
        location3: z.string().optional(),
        minTicketSize: z.number().optional(),
        maxTicketSize: z.number().optional(),
        targetReturnIRR: z.number().optional(),
        leadResponsibleId: z.string().optional(),
        leadMainContactId: z.string().optional(),
        leadResponsibleTeam: z.nativeEnum(TeamMember).optional(),
        leadMainContactTeam: z.nativeEnum(TeamMember).optional(),
        physicalAddress: z.string().optional(),
        website: z.string().optional(),
        lastContactDate: z.date().optional(),
        acceptMarketingList: z.boolean().optional(),
        otherFacts: z.string().optional(),
        lastNotes: z.string().optional(),
        department: z.nativeEnum(Department).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const {
        email,
        name,
        language,
        investorType,
        preferredLocation,
        companyName,
        representativeName,
        phoneNumber,
        type,
        strategy1,
        segment1,
        strategy2,
        segment2,
        strategy3,
        segment3,
        location1,
        location2,
        location3,
        minTicketSize,
        maxTicketSize,
        targetReturnIRR,
        leadResponsibleId,
        leadMainContactId,
        leadResponsibleTeam,
        leadMainContactTeam,
        physicalAddress,
        website,
        lastContactDate,
        acceptMarketingList,
        otherFacts,
        lastNotes,
        department,
      } = input;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Map investor type string to enum
      const investorTypeEnum = mapInvestorTypeToEnum(investorType);

      // Validate lead users are TEAM or ADMIN
      await validateLeadUser(leadResponsibleId, "Lead Responsible");
      await validateLeadUser(leadMainContactId, "Lead Main Contact");

      // Generate a random password
      const generatedPassword = generatePassword();

      try {
        // Create the user using better-auth
        const newUser = await auth.api.signUpEmail({
          body: {
            name,
            email,
            password: generatedPassword,
          },
        });

        if (!newUser.user) {
          throw new Error("Failed to create user");
        }

        // Update user with investor-specific fields
        await prisma.user.update({
          where: { id: newUser.user.id },
          data: {
            investorType: investorTypeEnum,
            preferredLocation,
            companyName,
            representativeName,
            phoneNumber,
            type,
            strategy1,
            segment1,
            strategy2,
            segment2,
            strategy3,
            segment3,
            location1,
            location2,
            location3,
            minTicketSize,
            maxTicketSize,
            targetReturnIRR,
            leadResponsibleId,
            leadMainContactId,
            leadResponsibleTeam,
            leadMainContactTeam,
            physicalAddress,
            website,
            lastContactDate,
            acceptMarketingList,
            otherFacts,
            lastNotes,
            department,
          },
        });

        await sendInviteEmail({
          userEmail: email,
          password: generatedPassword,
          language,
          inviteLink: "https://www.harborpartners.app/login",
        });

        return {
          success: true,
          user: {
            id: newUser.user.id,
            email: newUser.user.email,
            name: newUser.user.name,
          },
        };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to invite investor: ${error.message}`);
        }
        throw error;
      }
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().email().optional(),
        name: z.string().min(1).optional(),
        investorType: z.enum(["<€10M", "€10M-€100M", ">€100M"]).optional(),
        preferredLocation: z.string().optional(),
        companyName: z.string().optional(),
        representativeName: z.string().optional(),
        phoneNumber: z.string().optional(),
        type: z.nativeEnum(InvestorClientType).optional(),
        strategy1: z.nativeEnum(InvestorStrategy).optional(),
        segment1: z.nativeEnum(InvestorSegment).optional(),
        strategy2: z.nativeEnum(InvestorStrategy).optional(),
        segment2: z.nativeEnum(InvestorSegment).optional(),
        strategy3: z.nativeEnum(InvestorStrategy).optional(),
        segment3: z.nativeEnum(InvestorSegment).optional(),
        location1: z.string().optional(),
        location2: z.string().optional(),
        location3: z.string().optional(),
        minTicketSize: z.number().optional(),
        maxTicketSize: z.number().optional(),
        targetReturnIRR: z.number().optional(),
        leadResponsibleId: z.string().nullable().optional(),
        leadMainContactId: z.string().nullable().optional(),
        leadResponsibleTeam: z.nativeEnum(TeamMember).optional(),
        leadMainContactTeam: z.nativeEnum(TeamMember).optional(),
        physicalAddress: z.string().optional(),
        website: z.string().optional(),
        lastContactDate: z.date().nullable().optional(),
        acceptMarketingList: z.boolean().optional(),
        otherFacts: z.string().optional(),
        lastNotes: z.string().optional(),
        department: z.nativeEnum(Department).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;

      // Validate lead users are TEAM or ADMIN if provided
      if (updateData.leadResponsibleId !== undefined) {
        await validateLeadUser(
          updateData.leadResponsibleId,
          "Lead Responsible"
        );
      }

      if (updateData.leadMainContactId !== undefined) {
        await validateLeadUser(
          updateData.leadMainContactId,
          "Lead Main Contact"
        );
      }

      // Map investor type string to enum if provided
      const { investorType: investorTypeString, ...restData } = updateData;
      const data: Record<string, unknown> = { ...restData };

      if (investorTypeString !== undefined) {
        data.investorType = mapInvestorTypeToEnum(investorTypeString);
      }

      const user = await prisma.user.update({
        where: { id },
        data: data as Parameters<typeof prisma.user.update>[0]["data"],
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      return user;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.delete({
        where: { id: input.id },
        select: {
          name: true,
          email: true,
        },
      });
      return user;
    }),

  getNotes: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const notes = await prisma.userNote.findMany({
        where: { userId: input.userId },
        include: {
          createdByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return notes;
    }),

  addNote: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        note: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, note } = input;

      // Create note
      const newNote = await prisma.userNote.create({
        data: {
          userId,
          note,
          createdBy: ctx.auth.user.id,
        },
        include: {
          createdByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Update lastNotes on user
      await prisma.user.update({
        where: { id: userId },
        data: {
          lastNotes: note,
        },
      });

      return newNote;
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          email: true,
          investorType: true,
          preferredLocation: true,
          companyName: true,
          representativeName: true,
          phoneNumber: true,
          type: true,
          strategy1: true,
          segment1: true,
          strategy2: true,
          segment2: true,
          strategy3: true,
          segment3: true,
          location1: true,
          location2: true,
          location3: true,
          minTicketSize: true,
          maxTicketSize: true,
          targetReturnIRR: true,
          leadResponsibleId: true,
          leadMainContactId: true,
          leadResponsibleTeam: true,
          leadMainContactTeam: true,
          physicalAddress: true,
          website: true,
          lastContactDate: true,
          acceptMarketingList: true,
          otherFacts: true,
          lastNotes: true,
          department: true,
          leadResponsible: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          leadMainContact: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error("Investor not found");
      }

      return user;
    }),
});
