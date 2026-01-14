import z from "zod";
import { PAGINATION } from "@/config/constants";
import {
  EbitdaRange,
  Industry,
  IndustrySubsector,
  OpportunityStatus,
  OpportunityType,
  RealEstateAssetType,
  RealEstateInvestmentType,
  Role,
  SalesRange,
  Type,
  TypeDetails,
} from "@/generated/prisma";
import { inngest } from "@/inngest/client";
import { calculateCAGR } from "@/lib/cagr-calculator";
import prisma from "@/lib/db";
import { deleteFromUploadthing } from "@/lib/uploadthing-server";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { triggerCommissionCalculations } from "@/features/commissions/server/calculations";

const CAGR_MIN = 0;
const CAGR_MAX = 100;

// Helper function to parse optional float values
const parseOptionalFloat = (value?: string): number | null =>
  value ? Number.parseFloat(value) : null;

export const mergerAndAcquisitionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        type: z.enum(Type).optional(),
        typeDetails: z.enum(TypeDetails).optional(),
        industry: z.enum(Industry).optional(),
        industrySubsector: z.enum(IndustrySubsector).optional(),
        sales: z.enum(SalesRange).optional(),
        ebitda: z.enum(EbitdaRange).optional(),
        ebitdaNormalized: z.string().optional(),
        netDebt: z.string().optional(),
        salesCAGR: z.string().optional(),
        ebitdaCAGR: z.string().optional(),
        assetIncluded: z.enum(["yes", "no"]).optional(),
        estimatedAssetValue: z.string().optional(),
        preNDANotes: z.string().optional(),
        im: z.string().optional(),
        entrepriseValue: z.string().optional(),
        equityValue: z.string().optional(),
        evDashEbitdaEntry: z.string().optional(),
        evDashEbitdaExit: z.string().optional(),
        ebitdaMargin: z.string().optional(),
        fcf: z.string().optional(),
        netDebtDashEbitda: z.string().optional(),
        capexItensity: z.string().optional(),
        workingCapitalNeeds: z.string().optional(),
        postNDANotes: z.string().optional(),
        coInvestment: z.enum(["yes", "no"]).optional(),
        equityContribution: z.string().optional(),
        grossIRR: z.string().optional(),
        netIRR: z.string().optional(),
        moic: z.string().optional(),
        cashOnCashReturn: z.string().optional(),
        cashConvertion: z.string().optional(),
        entryMultiple: z.string().optional(),
        exitExpectedMultiple: z.string().optional(),
        holdPeriod: z.string().optional(),
        clientAcquisitionerId: z.string().optional(),
        accountManagerIds: z.string().array().optional(),
        images: z.string().array().optional(),
        graphRows: z.array(
          z.object({
            year: z.string(),
            revenue: z.number(),
            ebitda: z.number(),
            ebitdaMargin: z.number(),
          })
        ).optional(),
      })
    )
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This is a complex mutation
    .mutation(async ({ ctx, input }) => {
      // Validate client acquisitioner if provided
      if (input.clientAcquisitionerId) {
        const clientAcquisitioner = await prisma.user.findUnique({
          where: { id: input.clientAcquisitionerId },
          select: { role: true },
        });
        if (!clientAcquisitioner) {
          throw new Error("Client acquisitioner user not found");
        }
        if (
          clientAcquisitioner.role !== Role.TEAM &&
          clientAcquisitioner.role !== Role.ADMIN
        ) {
          throw new Error("Client acquisitioner must have TEAM or ADMIN role");
        }
      }

      // Validate account managers if provided
      if (input.accountManagerIds && input.accountManagerIds.length > 0) {
        const accountManagers = await prisma.user.findMany({
          where: {
            id: { in: input.accountManagerIds },
          },
          select: { id: true, role: true },
        });

        if (accountManagers.length !== input.accountManagerIds.length) {
          throw new Error("One or more account managers not found");
        }

        const invalidRoles = accountManagers.filter(
          (user) => user.role !== Role.TEAM && user.role !== Role.ADMIN
        );
        if (invalidRoles.length > 0) {
          throw new Error("All account managers must have TEAM or ADMIN role");
        }
      }

      // Calculate CAGR values from graph rows if provided
      const graphRows = input.graphRows || [];
      const { salesCAGR, ebitdaCAGR } = calculateCAGR(graphRows as any);

      // Convert string numbers to floats where needed
      const data = {
        userId: ctx.auth.user.id,
        name: input.name,
        description: input.description,
        type: input.type,
        typeDetails: input.typeDetails,
        industry: input.industry,
        industrySubsector: input.industrySubsector,
        sales: input.sales,
        ebitda: input.ebitda,
        ebitdaNormalized: parseOptionalFloat(input.ebitdaNormalized),
        netDebt: parseOptionalFloat(input.netDebt),
        salesCAGR: salesCAGR,
        ebitdaCAGR: ebitdaCAGR,
        assetIncluded: input.assetIncluded === "yes",
        estimatedAssetValue: parseOptionalFloat(input.estimatedAssetValue),
        preNDANotes: input.preNDANotes,
        im: input.im,
        entrepriseValue: parseOptionalFloat(input.entrepriseValue),
        equityValue: parseOptionalFloat(input.equityValue),
        evDashEbitdaEntry: parseOptionalFloat(input.evDashEbitdaEntry),
        evDashEbitdaExit: parseOptionalFloat(input.evDashEbitdaExit),
        ebitdaMargin: parseOptionalFloat(input.ebitdaMargin),
        fcf: parseOptionalFloat(input.fcf),
        netDebtDashEbitda: parseOptionalFloat(input.netDebtDashEbitda),
        capexItensity: parseOptionalFloat(input.capexItensity),
        workingCapitalNeeds: parseOptionalFloat(input.workingCapitalNeeds),
        postNDANotes: input.postNDANotes,
        coInvestment: input.coInvestment === "yes",
        equityContribution: parseOptionalFloat(input.equityContribution),
        grossIRR: parseOptionalFloat(input.grossIRR),
        netIRR: parseOptionalFloat(input.netIRR),
        moic: parseOptionalFloat(input.moic),
        cashOnCashReturn: parseOptionalFloat(input.cashOnCashReturn),
        cashConvertion: parseOptionalFloat(input.cashConvertion),
        entryMultiple: parseOptionalFloat(input.entryMultiple),
        exitExpectedMultiple: parseOptionalFloat(input.exitExpectedMultiple),
        holdPeriod: parseOptionalFloat(input.holdPeriod),
        clientAcquisitionerId: input.clientAcquisitionerId || null,
        images: input.images || [],
        graphRows: graphRows,
      };

      // Create the opportunity with analytics
      const created = await prisma.mergerAndAcquisition.create({
        data: {
          ...data,
          analytics: {
            create: {},
          },
        },
      });

      // Create account manager assignments if provided
      if (input.accountManagerIds && input.accountManagerIds.length > 0) {
        await prisma.opportunityAccountManager.createMany({
          data: input.accountManagerIds.map((userId) => ({
            opportunityId: created.id,
            opportunityType: OpportunityType.MNA,
            userId,
          })),
        });
      }

      // Trigger translation if description is provided
      if (input.description) {
        await inngest.send({
          name: "opportunity/translate-description",
          data: {
            opportunityId: created.id,
            description: input.description,
          },
        });
      }

      return created;
    }),
  remove: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.delete({
        where: { id: input.id },
      })
    ),
  updateName: adminProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { name: input.name },
      })
    ),
  updateDescription: adminProcedure
    .input(
      z.object({
        id: z.string(),
        description: z.string().min(1),
        isEnglish: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Update the description in the database
      const updated = await prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: input.isEnglish
          ? { englishDescription: input.description }
          : { description: input.description },
      });

      // Trigger async translation to English via Inngest only for Portuguese descriptions
      if (!input.isEnglish) {
        await inngest.send({
          name: "opportunity/translate-description",
          data: {
            opportunityId: input.id,
            description: input.description,
          },
        });
      }

      return updated;
    }),
  updateType: adminProcedure
    .input(z.object({ id: z.string(), type: z.enum(Type) }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { type: input.type },
      })
    ),
  removeType: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { type: null },
      })
    ),
  updateTypeDetails: adminProcedure
    .input(z.object({ id: z.string(), typeDetails: z.enum(TypeDetails) }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { typeDetails: input.typeDetails },
      })
    ),
  removeTypeDetails: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { typeDetails: null },
      })
    ),
  updateIndustry: adminProcedure
    .input(z.object({ id: z.string(), industry: z.enum(Industry) }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { industry: input.industry },
      })
    ),
  removeIndustry: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { industry: null },
      })
    ),
  updateIndustrySubsector: adminProcedure
    .input(
      z.object({ id: z.string(), industrySubsector: z.enum(IndustrySubsector) })
    )
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { industrySubsector: input.industrySubsector },
      })
    ),
  removeIndustrySubsector: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { industrySubsector: null },
      })
    ),
  updateSales: adminProcedure
    .input(z.object({ id: z.string(), sales: z.enum(SalesRange) }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { sales: input.sales },
      })
    ),
  removeSales: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { sales: null },
      })
    ),
  updateEbitda: adminProcedure
    .input(z.object({ id: z.string(), ebitda: z.enum(EbitdaRange) }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { ebitda: input.ebitda },
      })
    ),
  removeEbitda: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { ebitda: null },
      })
    ),
  updateEbitdaNormalized: adminProcedure
    .input(z.object({ id: z.string(), ebitdaNormalized: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { ebitdaNormalized: input.ebitdaNormalized },
      })
    ),
  removeEbitdaNormalized: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { ebitdaNormalized: null },
      })
    ),
  updateNetDebt: adminProcedure
    .input(z.object({ id: z.string(), netDebt: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { netDebt: input.netDebt },
      })
    ),
  removeNetDebt: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { netDebt: null },
      })
    ),
  updateSalesCAGR: adminProcedure
    .input(
      z.object({
        id: z.string(),
        salesCAGR: z
          .number()
          .min(CAGR_MIN)
          .max(CAGR_MAX, "CAGR must be between 0 and 100"),
      })
    )
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { salesCAGR: input.salesCAGR },
      })
    ),
  removeSalesCAGR: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { salesCAGR: null },
      })
    ),
  updateEbitdaCAGR: adminProcedure
    .input(
      z.object({
        id: z.string(),
        ebitdaCAGR: z
          .number()
          .min(CAGR_MIN)
          .max(CAGR_MAX, "CAGR must be between 0 and 100"),
      })
    )
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { ebitdaCAGR: input.ebitdaCAGR },
      })
    ),
  removeEbitdaCAGR: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { ebitdaCAGR: null },
      })
    ),
  updateAssetIncluded: adminProcedure
    .input(z.object({ id: z.string(), assetIncluded: z.boolean() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { assetIncluded: input.assetIncluded },
      })
    ),
  removeAssetIncluded: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { assetIncluded: null },
      })
    ),
  updateEstimatedAssetValue: adminProcedure
    .input(z.object({ id: z.string(), estimatedAssetValue: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { estimatedAssetValue: input.estimatedAssetValue },
      })
    ),
  removeEstimatedAssetValue: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { estimatedAssetValue: null },
      })
    ),
  updateGraphRows: adminProcedure
    .input(
      z.object({
        id: z.string(),
        graphRows: z.array(
          z.object({
            year: z.string(),
            revenue: z.number(),
            ebitda: z.number(),
            ebitdaMargin: z.number(),
          })
        ),
      })
    )
    .mutation(({ input }) => {
      // Calculate CAGR values from graph rows
      const { salesCAGR, ebitdaCAGR } = calculateCAGR(input.graphRows as any);
      
      return prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { 
          graphRows: input.graphRows,
          salesCAGR: salesCAGR,
          ebitdaCAGR: ebitdaCAGR,
        },
      });
    }),
  updateImages: adminProcedure
    .input(
      z.object({
        id: z.string(),
        images: z.array(z.string()),
      })
    )
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { images: input.images },
      })
    ),
  removeImage: adminProcedure
    .input(
      z.object({
        id: z.string(),
        imageUrl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await deleteFromUploadthing(input.imageUrl);
      const opportunity = await prisma.mergerAndAcquisition.findUniqueOrThrow({
        where: { id: input.id },
      });
      const updatedImages = (opportunity.images || []).filter(
        (img) => img !== input.imageUrl
      );
      return prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { images: updatedImages },
      });
    }),
  updateIm: adminProcedure
    .input(z.object({ id: z.string(), im: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { im: input.im },
      })
    ),
  removeIm: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { im: null },
      })
    ),
  updateEnterpriseValue: adminProcedure
    .input(z.object({ id: z.string(), entrepriseValue: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { entrepriseValue: input.entrepriseValue },
      })
    ),
  removeEnterpriseValue: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { entrepriseValue: null },
      })
    ),
  updateEquityValue: adminProcedure
    .input(z.object({ id: z.string(), equityValue: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { equityValue: input.equityValue },
      })
    ),
  removeEquityValue: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { equityValue: null },
      })
    ),
  updateEvDashEbitdaEntry: adminProcedure
    .input(z.object({ id: z.string(), evDashEbitdaEntry: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { evDashEbitdaEntry: input.evDashEbitdaEntry },
      })
    ),
  removeEvDashEbitdaEntry: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { evDashEbitdaEntry: null },
      })
    ),
  updateEvDashEbitdaExit: adminProcedure
    .input(z.object({ id: z.string(), evDashEbitdaExit: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { evDashEbitdaExit: input.evDashEbitdaExit },
      })
    ),
  removeEvDashEbitdaExit: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { evDashEbitdaExit: null },
      })
    ),
  updateEbitdaMargin: adminProcedure
    .input(z.object({ id: z.string(), ebitdaMargin: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { ebitdaMargin: input.ebitdaMargin },
      })
    ),
  removeEbitdaMargin: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { ebitdaMargin: null },
      })
    ),
  updateFcf: adminProcedure
    .input(z.object({ id: z.string(), fcf: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { fcf: input.fcf },
      })
    ),
  removeFcf: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { fcf: null },
      })
    ),
  updateNetDebtDashEbitda: adminProcedure
    .input(z.object({ id: z.string(), netDebtDashEbitda: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { netDebtDashEbitda: input.netDebtDashEbitda },
      })
    ),
  removeNetDebtDashEbitda: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { netDebtDashEbitda: null },
      })
    ),
  updateCapexItensity: adminProcedure
    .input(z.object({ id: z.string(), capexItensity: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { capexItensity: input.capexItensity },
      })
    ),
  removeCapexItensity: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { capexItensity: null },
      })
    ),
  updateWorkingCapitalNeeds: adminProcedure
    .input(z.object({ id: z.string(), workingCapitalNeeds: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { workingCapitalNeeds: input.workingCapitalNeeds },
      })
    ),
  removeWorkingCapitalNeeds: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { workingCapitalNeeds: null },
      })
    ),
  updateCoInvestment: adminProcedure
    .input(z.object({ id: z.string(), coInvestment: z.boolean() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { coInvestment: input.coInvestment },
      })
    ),
  removeCoInvestment: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { coInvestment: null },
      })
    ),
  updateEquityContribution: adminProcedure
    .input(z.object({ id: z.string(), equityContribution: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { equityContribution: input.equityContribution },
      })
    ),
  removeEquityContribution: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { equityContribution: null },
      })
    ),
  updateGrossIRR: adminProcedure
    .input(z.object({ id: z.string(), grossIRR: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { grossIRR: input.grossIRR },
      })
    ),
  removeGrossIRR: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { grossIRR: null },
      })
    ),
  updateNetIRR: adminProcedure
    .input(z.object({ id: z.string(), netIRR: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { netIRR: input.netIRR },
      })
    ),
  removeNetIRR: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { netIRR: null },
      })
    ),
  updateMoic: adminProcedure
    .input(z.object({ id: z.string(), moic: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { moic: input.moic },
      })
    ),
  removeMoic: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { moic: null },
      })
    ),
  updateCashOnCashReturn: adminProcedure
    .input(z.object({ id: z.string(), cashOnCashReturn: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { cashOnCashReturn: input.cashOnCashReturn },
      })
    ),
  removeCashOnCashReturn: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { cashOnCashReturn: null },
      })
    ),
  updateCashConvertion: adminProcedure
    .input(z.object({ id: z.string(), cashConvertion: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { cashConvertion: input.cashConvertion },
      })
    ),
  removeCashConvertion: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { cashConvertion: null },
      })
    ),
  updateEntryMultiple: adminProcedure
    .input(z.object({ id: z.string(), entryMultiple: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { entryMultiple: input.entryMultiple },
      })
    ),
  removeEntryMultiple: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { entryMultiple: null },
      })
    ),
  updateExitExpectedMultiple: adminProcedure
    .input(z.object({ id: z.string(), exitExpectedMultiple: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { exitExpectedMultiple: input.exitExpectedMultiple },
      })
    ),
  removeExitExpectedMultiple: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { exitExpectedMultiple: null },
      })
    ),
  updateHoldPeriod: adminProcedure
    .input(z.object({ id: z.string(), holdPeriod: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { holdPeriod: input.holdPeriod },
      })
    ),
  removeHoldPeriod: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { holdPeriod: null },
      })
    ),
  updateShareholderStructure: adminProcedure
    .input(
      z.object({
        id: z.string(),
        shareholderStructure: z.array(z.string()),
      })
    )
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { shareholderStructure: input.shareholderStructure },
      })
    ),
  removeShareholderStructure: adminProcedure
    .input(
      z.object({
        id: z.string(),
        imageUrl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await deleteFromUploadthing(input.imageUrl);
      const opportunity = await prisma.mergerAndAcquisition.findUniqueOrThrow({
        where: { id: input.id },
      });
      const updatedImages = (opportunity.shareholderStructure || []).filter(
        (img) => img !== input.imageUrl
      );
      return prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { shareholderStructure: updatedImages },
      });
    }),
  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["ACTIVE", "INACTIVE", "CONCLUDED"]),
      })
    )
    .mutation(async ({ input }) => {
      const result = await prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { status: input.status },
      });

      // Trigger commission calculations when status changes to CONCLUDED
      if (input.status === "CONCLUDED") {
        await triggerCommissionCalculations(input.id, OpportunityType.MNA);
      }

      return result;
    }),
  updateFinalValues: adminProcedure
    .input(
      z.object({
        id: z.string(),
        final_amount: z.number().optional(),
        closed_at: z.date().optional(),
        invested_person_id: z.string().nullable().optional(),
        followup_person_id: z.string().nullable().optional(),
        profit_amount: z.number().optional(),
        commissionable_amount: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const updateData: {
        final_amount?: number;
        closed_at?: Date;
        invested_person_id?: string | null;
        followup_person_id?: string | null;
        profit_amount?: number;
        commissionable_amount?: number;
      } = {};
      
      if (input.final_amount !== undefined) updateData.final_amount = input.final_amount;
      if (input.closed_at !== undefined) updateData.closed_at = input.closed_at;
      if (input.invested_person_id !== undefined) updateData.invested_person_id = input.invested_person_id;
      if (input.followup_person_id !== undefined) updateData.followup_person_id = input.followup_person_id;
      if (input.profit_amount !== undefined) updateData.profit_amount = input.profit_amount;
      if (input.commissionable_amount !== undefined) updateData.commissionable_amount = input.commissionable_amount;

      const result = await prisma.opportunityAnalytics.update({
        where: { mergerAndAcquisitionId: input.id },
        data: updateData,
      });

      // Trigger commission calculations when final values are updated
      // (in case opportunity was already CONCLUDED before final values were set)
      await triggerCommissionCalculations(input.id, OpportunityType.MNA);

      return result;
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const opportunity = await prisma.mergerAndAcquisition.findUniqueOrThrow({
        where: { id: input.id },
        include: {
          clientAcquisitioner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          analytics: {
            include: {
              invested_person: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              followup_person: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      const accountManagers = await prisma.opportunityAccountManager.findMany({
        where: {
          opportunityId: input.id,
          opportunityType: OpportunityType.MNA,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return {
        ...opportunity,
        accountManagers: accountManagers.map((am) => am.user),
      };
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
        status: z.enum(["all", "ACTIVE", "INACTIVE", "CONCLUDED"]).default("ACTIVE"),
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize, search, status } = input;
      
      const whereCondition: {
        name: { contains: string; mode: "insensitive" };
        status?: OpportunityStatus;
      } = {
        name: { contains: search, mode: "insensitive" },
        ...(status !== "all" && { status: status as OpportunityStatus }),
      };
      
      const [items, totalCount] = await Promise.all([
        prisma.mergerAndAcquisition.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: whereCondition,
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.mergerAndAcquisition.count({
          where: whereCondition,
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
});

export const opportunitiesRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        type: z.enum(["all", "mna", "realEstate"]).default("all"),
        search: z.string().default(""),
        status: z.enum(["all", "ACTIVE", "INACTIVE", "CONCLUDED"]).default("all").optional(),
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize, type, search, status } = input;

      // Build where conditions for M&A
      const mnaWhere: {
        name: { contains: string; mode: "insensitive" };
        status?: OpportunityStatus;
      } = {
        name: { contains: search, mode: "insensitive" as const },
      };
      if (status && status !== "all") {
        mnaWhere.status = status as OpportunityStatus;
      }

      // Build where conditions for Real Estate
      const realEstateWhere: {
        name: { contains: string; mode: "insensitive" };
        status?: OpportunityStatus;
      } = {
        name: { contains: search, mode: "insensitive" as const },
      };
      if (status && status !== "all") {
        realEstateWhere.status = status as OpportunityStatus;
      }

      // Fetch data based on type filter
      let mnaItems: Array<{
        id: string;
        name: string;
        description: string | null;
        englishDescription: string | null;
        images: string[];
        status: OpportunityStatus;
        createdAt: Date;
        updatedAt: Date;
      }> = [];
      let realEstateItems: Array<{
        id: string;
        name: string;
        description: string | null;
        englishDescription: string | null;
        images: string[];
        status: OpportunityStatus;
        createdAt: Date;
        updatedAt: Date;
      }> = [];
      let mnaCount = 0;
      let realEstateCount = 0;

      if (type === "all" || type === "mna") {
        [mnaItems, mnaCount] = await Promise.all([
          prisma.mergerAndAcquisition.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: mnaWhere,
            orderBy: { updatedAt: "desc" },
            select: {
              id: true,
              name: true,
              description: true,
              englishDescription: true,
              images: true,
              status: true,
              createdAt: true,
              updatedAt: true,
            },
          }),
          prisma.mergerAndAcquisition.count({ where: mnaWhere }),
        ]);
      }

      if (type === "all" || type === "realEstate") {
        [realEstateItems, realEstateCount] = await Promise.all([
          prisma.realEstate.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: realEstateWhere,
            orderBy: { updatedAt: "desc" },
            select: {
              id: true,
              name: true,
              description: true,
              englishDescription: true,
              images: true,
              status: true,
              createdAt: true,
              updatedAt: true,
            },
          }),
          prisma.realEstate.count({ where: realEstateWhere }),
        ]);
      }

      // Combine and transform items with type information
      const items = [
        ...mnaItems.map((item) => ({
          ...item,
          opportunityType: "mna" as const,
        })),
        ...realEstateItems.map((item) => ({
          ...item,
          opportunityType: "realEstate" as const,
        })),
      ];

      // Sort by updatedAt descending when showing all types
      if (type === "all") {
        items.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }

      const totalCount = mnaCount + realEstateCount;
      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
});

export const realEstateRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        asset: z.enum(RealEstateAssetType).optional(),
        nRoomsLastYear: z.number().nullable().optional(),
        noi: z.number().nullable().optional(),
        occupancyLastYear: z.number().nullable().optional(),
        walt: z.number().nullable().optional(),
        nBeds: z.number().nullable().optional(),
        investment: z.enum(RealEstateInvestmentType).optional(),
        subRent: z.number().nullable().optional(),
        rentPerSqm: z.number().nullable().optional(),
        subYield: z.number().nullable().optional(),
        capex: z.number().nullable().optional(),
        capexPerSqm: z.number().nullable().optional(),
        sale: z.number().nullable().optional(),
        salePerSqm: z.number().nullable().optional(),
        location: z.string().optional(),
        area: z.number().nullable().optional(),
        value: z.number().nullable().optional(),
        yield: z.number().nullable().optional(),
        rent: z.number().nullable().optional(),
        gcaAboveGround: z.number().nullable().optional(),
        gcaBelowGround: z.number().nullable().optional(),
        license: z.string().optional(),
        irr: z.number().nullable().optional(),
        coc: z.number().nullable().optional(),
        licenseStage: z.string().optional(),
        holdingPeriod: z.number().nullable().optional(),
        breakEvenOccupancy: z.number().nullable().optional(),
        vacancyRate: z.number().nullable().optional(),
        estimatedRentValue: z.number().nullable().optional(),
        occupancyRate: z.number().nullable().optional(),
        moic: z.number().nullable().optional(),
        price: z.number().nullable().optional(),
        totalInvestment: z.number().nullable().optional(),
        profitOnCost: z.number().nullable().optional(),
        profit: z.number().nullable().optional(),
        sofCosts: z.number().nullable().optional(),
        sellPerSqm: z.number().nullable().optional(),
        gdv: z.number().nullable().optional(),
        wault: z.number().nullable().optional(),
        debtServiceCoverageRatio: z.number().nullable().optional(),
        expectedExitYield: z.number().nullable().optional(),
        ltv: z.number().nullable().optional(),
        ltc: z.number().nullable().optional(),
        yieldOnCost: z.number().nullable().optional(),
        coInvestment: z.boolean().optional(),
        gpEquityValue: z.number().nullable().optional(),
        gpEquityPercentage: z.number().nullable().optional(),
        totalEquityRequired: z.number().nullable().optional(),
        projectIRR: z.number().nullable().optional(),
        investorIRR: z.number().nullable().optional(),
        coInvestmentHoldPeriod: z.number().nullable().optional(),
        coInvestmentBreakEvenOccupancy: z.number().nullable().optional(),
        sponsorPresentation: z.string().optional(),
        promoteStructure: z.string().optional(),
        clientAcquisitionerId: z.string().optional(),
        accountManagerIds: z.string().array().optional(),
        images: z.string().array().optional(),
      })
    )
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This is a complex mutation
    .mutation(async ({ ctx, input }) => {
      // Validate client acquisitioner if provided
      if (input.clientAcquisitionerId) {
        const clientAcquisitioner = await prisma.user.findUnique({
          where: { id: input.clientAcquisitionerId },
          select: { role: true },
        });
        if (!clientAcquisitioner) {
          throw new Error("Client acquisitioner user not found");
        }
        if (
          clientAcquisitioner.role !== Role.TEAM &&
          clientAcquisitioner.role !== Role.ADMIN
        ) {
          throw new Error("Client acquisitioner must have TEAM or ADMIN role");
        }
      }

      // Validate account managers if provided
      if (input.accountManagerIds && input.accountManagerIds.length > 0) {
        const accountManagers = await prisma.user.findMany({
          where: {
            id: { in: input.accountManagerIds },
          },
          select: { id: true, role: true },
        });

        if (accountManagers.length !== input.accountManagerIds.length) {
          throw new Error("One or more account managers not found");
        }

        const invalidRoles = accountManagers.filter(
          (user) => user.role !== Role.TEAM && user.role !== Role.ADMIN
        );
        if (invalidRoles.length > 0) {
          throw new Error("All account managers must have TEAM or ADMIN role");
        }
      }

      const created = await prisma.realEstate.create({
        data: {
          name: input.name,
          description: input.description,
          asset: input.asset,
          nRoomsLastYear: input.nRoomsLastYear,
          noi: input.noi,
          occupancyLastYear: input.occupancyLastYear,
          walt: input.walt,
          nBeds: input.nBeds,
          investment: input.investment,
          subRent: input.subRent,
          rentPerSqm: input.rentPerSqm,
          subYield: input.subYield,
          capex: input.capex,
          capexPerSqm: input.capexPerSqm,
          sale: input.sale,
          salePerSqm: input.salePerSqm,
          location: input.location,
          area: input.area,
          value: input.value,
          yield: input.yield,
          rent: input.rent,
          gcaAboveGround: input.gcaAboveGround,
          gcaBelowGround: input.gcaBelowGround,
          license: input.license,
          irr: input.irr,
          coc: input.coc,
          licenseStage: input.licenseStage,
          holdingPeriod: input.holdingPeriod,
          breakEvenOccupancy: input.breakEvenOccupancy,
          vacancyRate: input.vacancyRate,
          estimatedRentValue: input.estimatedRentValue,
          occupancyRate: input.occupancyRate,
          moic: input.moic,
          price: input.price,
          totalInvestment: input.totalInvestment,
          profitOnCost: input.profitOnCost,
          profit: input.profit,
          sofCosts: input.sofCosts,
          sellPerSqm: input.sellPerSqm,
          gdv: input.gdv,
          wault: input.wault,
          debtServiceCoverageRatio: input.debtServiceCoverageRatio,
          expectedExitYield: input.expectedExitYield,
          ltv: input.ltv,
          ltc: input.ltc,
          yieldOnCost: input.yieldOnCost,
          coInvestment: input.coInvestment,
          gpEquityValue: input.gpEquityValue,
          gpEquityPercentage: input.gpEquityPercentage,
          totalEquityRequired: input.totalEquityRequired,
          projectIRR: input.projectIRR,
          investorIRR: input.investorIRR,
          coInvestmentHoldPeriod: input.coInvestmentHoldPeriod,
          coInvestmentBreakEvenOccupancy: input.coInvestmentBreakEvenOccupancy,
          sponsorPresentation: input.sponsorPresentation,
          promoteStructure: input.promoteStructure,
          createdBy: ctx.auth.user.id,
          clientAcquisitionerId: input.clientAcquisitionerId || null,
          images: input.images || [],
          analytics: {
            create: {},
          },
        },
      });

      // Create account manager assignments if provided
      if (input.accountManagerIds && input.accountManagerIds.length > 0) {
        await prisma.opportunityAccountManager.createMany({
          data: input.accountManagerIds.map((userId) => ({
            opportunityId: created.id,
            opportunityType: OpportunityType.REAL_ESTATE,
            userId,
          })),
        });
      }

      // Trigger translation if description is provided
      if (input.description) {
        await inngest.send({
          name: "opportunity/translate-description",
          data: {
            opportunityId: created.id,
            description: input.description,
          },
        });
      }

      return created;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
        status: z.enum(["all", "ACTIVE", "INACTIVE", "CONCLUDED"]).default("ACTIVE"),
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize, search, status } = input;
      
      const whereCondition: {
        name: { contains: string; mode: "insensitive" };
        status?: OpportunityStatus;
      } = {
        name: { contains: search, mode: "insensitive" },
        ...(status !== "all" && { status: status as OpportunityStatus }),
      };
      
      const [items, totalCount] = await Promise.all([
        prisma.realEstate.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: whereCondition,
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.realEstate.count({
          where: whereCondition,
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
  remove: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.delete({
        where: { id: input.id },
      })
    ),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const opportunity = await prisma.realEstate.findUniqueOrThrow({
        where: { id: input.id },
        include: {
          clientAcquisitioner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          analytics: {
            include: {
              invested_person: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              followup_person: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      const accountManagers = await prisma.opportunityAccountManager.findMany({
        where: {
          opportunityId: input.id,
          opportunityType: OpportunityType.REAL_ESTATE,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return {
        ...opportunity,
        accountManagers: accountManagers.map((am) => am.user),
      };
    }),
  updateName: adminProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { name: input.name },
      })
    ),
  updateDescription: adminProcedure
    .input(
      z.object({
        id: z.string(),
        description: z.string().min(1),
        isEnglish: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Update the description in the database
      const updated = await prisma.realEstate.update({
        where: { id: input.id },
        data: input.isEnglish
          ? { englishDescription: input.description }
          : { description: input.description },
      });

      // Trigger async translation to English via Inngest only for Portuguese descriptions
      if (!input.isEnglish) {
        await inngest.send({
          name: "opportunity/translate-description",
          data: {
            opportunityId: input.id,
            description: input.description,
          },
        });
      }

      return updated;
    }),
  updateImages: adminProcedure
    .input(
      z.object({
        id: z.string(),
        images: z.string().array(),
      })
    )
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { images: input.images },
      })
    ),
  removeImage: adminProcedure
    .input(
      z.object({
        id: z.string(),
        imageUrl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await deleteFromUploadthing(input.imageUrl);
      const opportunity = await prisma.realEstate.findUniqueOrThrow({
        where: { id: input.id },
      });
      const updatedImages = (opportunity.images || []).filter(
        (img) => img !== input.imageUrl
      );
      return prisma.realEstate.update({
        where: { id: input.id },
        data: { images: updatedImages },
      });
    }),
  // Pre-NDA Update Mutations
  updateAsset: adminProcedure
    .input(
      z.object({ id: z.string(), asset: z.nativeEnum(RealEstateAssetType) })
    )
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { asset: input.asset },
      })
    ),
  updateNRoomsLastYear: adminProcedure
    .input(z.object({ id: z.string(), nRoomsLastYear: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { nRoomsLastYear: input.nRoomsLastYear },
      })
    ),
  updateNOI: adminProcedure
    .input(z.object({ id: z.string(), noi: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { noi: input.noi },
      })
    ),
  updateOccupancyLastYear: adminProcedure
    .input(z.object({ id: z.string(), occupancyLastYear: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { occupancyLastYear: input.occupancyLastYear },
      })
    ),
  updateWALT: adminProcedure
    .input(z.object({ id: z.string(), walt: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { walt: input.walt },
      })
    ),
  updateNBeds: adminProcedure
    .input(z.object({ id: z.string(), nBeds: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { nBeds: input.nBeds },
      })
    ),
  updateInvestment: adminProcedure
    .input(
      z.object({
        id: z.string(),
        investment: z.nativeEnum(RealEstateInvestmentType),
      })
    )
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { investment: input.investment },
      })
    ),
  updateSubRent: adminProcedure
    .input(z.object({ id: z.string(), subRent: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { subRent: input.subRent },
      })
    ),
  updateRentPerSqm: adminProcedure
    .input(z.object({ id: z.string(), rentPerSqm: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { rentPerSqm: input.rentPerSqm },
      })
    ),
  updateSubYield: adminProcedure
    .input(z.object({ id: z.string(), subYield: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { subYield: input.subYield },
      })
    ),
  updateCapex: adminProcedure
    .input(z.object({ id: z.string(), capex: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { capex: input.capex },
      })
    ),
  updateCapexPerSqm: adminProcedure
    .input(z.object({ id: z.string(), capexPerSqm: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { capexPerSqm: input.capexPerSqm },
      })
    ),
  updateSale: adminProcedure
    .input(z.object({ id: z.string(), sale: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { sale: input.sale },
      })
    ),
  updateSalePerSqm: adminProcedure
    .input(z.object({ id: z.string(), salePerSqm: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { salePerSqm: input.salePerSqm },
      })
    ),
  updateLocation: adminProcedure
    .input(z.object({ id: z.string(), location: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { location: input.location },
      })
    ),
  updateArea: adminProcedure
    .input(z.object({ id: z.string(), area: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { area: input.area },
      })
    ),
  updateValue: adminProcedure
    .input(z.object({ id: z.string(), value: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { value: input.value },
      })
    ),
  updateYield: adminProcedure
    .input(z.object({ id: z.string(), yield: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { yield: input.yield },
      })
    ),
  updateRent: adminProcedure
    .input(z.object({ id: z.string(), rent: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { rent: input.rent },
      })
    ),
  updateGCAAboveGround: adminProcedure
    .input(z.object({ id: z.string(), gcaAboveGround: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { gcaAboveGround: input.gcaAboveGround },
      })
    ),
  updateGCABelowGround: adminProcedure
    .input(z.object({ id: z.string(), gcaBelowGround: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { gcaBelowGround: input.gcaBelowGround },
      })
    ),
  // Post-NDA Update Mutations
  updateLicense: adminProcedure
    .input(z.object({ id: z.string(), license: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { license: input.license },
      })
    ),
  updateLicenseStage: adminProcedure
    .input(z.object({ id: z.string(), licenseStage: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { licenseStage: input.licenseStage },
      })
    ),
  updateIRR: adminProcedure
    .input(z.object({ id: z.string(), irr: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { irr: input.irr },
      })
    ),
  updateCOC: adminProcedure
    .input(z.object({ id: z.string(), coc: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { coc: input.coc },
      })
    ),
  updateHoldingPeriod: adminProcedure
    .input(z.object({ id: z.string(), holdingPeriod: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { holdingPeriod: input.holdingPeriod },
      })
    ),
  updateBreakEvenOccupancy: adminProcedure
    .input(
      z.object({ id: z.string(), breakEvenOccupancy: z.number().nullable() })
    )
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { breakEvenOccupancy: input.breakEvenOccupancy },
      })
    ),
  updateVacancyRate: adminProcedure
    .input(z.object({ id: z.string(), vacancyRate: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { vacancyRate: input.vacancyRate },
      })
    ),
  updateEstimatedRentValue: adminProcedure
    .input(
      z.object({ id: z.string(), estimatedRentValue: z.number().nullable() })
    )
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { estimatedRentValue: input.estimatedRentValue },
      })
    ),
  updateOccupancyRate: adminProcedure
    .input(z.object({ id: z.string(), occupancyRate: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { occupancyRate: input.occupancyRate },
      })
    ),
  updateMOIC: adminProcedure
    .input(z.object({ id: z.string(), moic: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { moic: input.moic },
      })
    ),
  updatePrice: adminProcedure
    .input(z.object({ id: z.string(), price: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { price: input.price },
      })
    ),
  updateTotalInvestment: adminProcedure
    .input(z.object({ id: z.string(), totalInvestment: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { totalInvestment: input.totalInvestment },
      })
    ),
  updateProfitOnCost: adminProcedure
    .input(z.object({ id: z.string(), profitOnCost: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { profitOnCost: input.profitOnCost },
      })
    ),
  updateProfit: adminProcedure
    .input(z.object({ id: z.string(), profit: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { profit: input.profit },
      })
    ),
  updateSofCosts: adminProcedure
    .input(z.object({ id: z.string(), sofCosts: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { sofCosts: input.sofCosts },
      })
    ),
  updateSellPerSqm: adminProcedure
    .input(z.object({ id: z.string(), sellPerSqm: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { sellPerSqm: input.sellPerSqm },
      })
    ),
  updateGDV: adminProcedure
    .input(z.object({ id: z.string(), gdv: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { gdv: input.gdv },
      })
    ),
  updateWAULT: adminProcedure
    .input(z.object({ id: z.string(), wault: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { wault: input.wault },
      })
    ),
  updateDebtServiceCoverageRatio: adminProcedure
    .input(
      z.object({
        id: z.string(),
        debtServiceCoverageRatio: z.number().nullable(),
      })
    )
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { debtServiceCoverageRatio: input.debtServiceCoverageRatio },
      })
    ),
  updateExpectedExitYield: adminProcedure
    .input(z.object({ id: z.string(), expectedExitYield: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { expectedExitYield: input.expectedExitYield },
      })
    ),
  updateLTV: adminProcedure
    .input(z.object({ id: z.string(), ltv: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { ltv: input.ltv },
      })
    ),
  updateLTC: adminProcedure
    .input(z.object({ id: z.string(), ltc: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { ltc: input.ltc },
      })
    ),
  updateYieldOnCost: adminProcedure
    .input(z.object({ id: z.string(), yieldOnCost: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { yieldOnCost: input.yieldOnCost },
      })
    ),
  // Limited Partner Update Mutations
  updateCoInvestment: adminProcedure
    .input(z.object({ id: z.string(), coInvestment: z.boolean() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { coInvestment: input.coInvestment },
      })
    ),
  updateGPEquityValue: adminProcedure
    .input(z.object({ id: z.string(), gpEquityValue: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { gpEquityValue: input.gpEquityValue },
      })
    ),
  updateGPEquityPercentage: adminProcedure
    .input(
      z.object({ id: z.string(), gpEquityPercentage: z.number().nullable() })
    )
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { gpEquityPercentage: input.gpEquityPercentage },
      })
    ),
  updateTotalEquityRequired: adminProcedure
    .input(
      z.object({ id: z.string(), totalEquityRequired: z.number().nullable() })
    )
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { totalEquityRequired: input.totalEquityRequired },
      })
    ),
  updateProjectIRR: adminProcedure
    .input(z.object({ id: z.string(), projectIRR: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { projectIRR: input.projectIRR },
      })
    ),
  updateInvestorIRR: adminProcedure
    .input(z.object({ id: z.string(), investorIRR: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { investorIRR: input.investorIRR },
      })
    ),
  updateCoInvestmentHoldPeriod: adminProcedure
    .input(
      z.object({
        id: z.string(),
        coInvestmentHoldPeriod: z.number().nullable(),
      })
    )
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { coInvestmentHoldPeriod: input.coInvestmentHoldPeriod },
      })
    ),
  updateCoInvestmentBreakEvenOccupancy: adminProcedure
    .input(
      z.object({
        id: z.string(),
        coInvestmentBreakEvenOccupancy: z.number().nullable(),
      })
    )
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: {
          coInvestmentBreakEvenOccupancy: input.coInvestmentBreakEvenOccupancy,
        },
      })
    ),
  updateSponsorPresentation: adminProcedure
    .input(z.object({ id: z.string(), sponsorPresentation: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { sponsorPresentation: input.sponsorPresentation },
      })
    ),
  updatePromoteStructure: adminProcedure
    .input(z.object({ id: z.string(), promoteStructure: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { promoteStructure: input.promoteStructure },
      })
    ),
  // Pre-NDA Remove Mutations
  removeAsset: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { asset: null },
      })
    ),
  removeNRoomsLastYear: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { nRoomsLastYear: null },
      })
    ),
  removeNOI: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { noi: null },
      })
    ),
  removeOccupancyLastYear: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { occupancyLastYear: null },
      })
    ),
  removeWALT: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { walt: null },
      })
    ),
  removeNBeds: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { nBeds: null },
      })
    ),
  removeInvestment: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { investment: null },
      })
    ),
  removeSubRent: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { subRent: null },
      })
    ),
  removeRentPerSqm: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { rentPerSqm: null },
      })
    ),
  removeSubYield: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { subYield: null },
      })
    ),
  removeCapex: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { capex: null },
      })
    ),
  removeCapexPerSqm: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { capexPerSqm: null },
      })
    ),
  removeSale: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { sale: null },
      })
    ),
  removeSalePerSqm: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { salePerSqm: null },
      })
    ),
  removeLocation: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { location: null },
      })
    ),
  removeArea: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { area: null },
      })
    ),
  removeValue: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { value: null },
      })
    ),
  removeYield: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { yield: null },
      })
    ),
  removeRent: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { rent: null },
      })
    ),
  removeGCAAboveGround: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { gcaAboveGround: null },
      })
    ),
  removeGCABelowGround: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { gcaBelowGround: null },
      })
    ),
  // Post-NDA Remove Mutations
  removeLicense: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { license: null },
      })
    ),
  removeLicenseStage: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { licenseStage: null },
      })
    ),
  removeIRR: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { irr: null },
      })
    ),
  removeCOC: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { coc: null },
      })
    ),
  removeHoldingPeriod: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { holdingPeriod: null },
      })
    ),
  removeBreakEvenOccupancy: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { breakEvenOccupancy: null },
      })
    ),
  removeVacancyRate: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { vacancyRate: null },
      })
    ),
  removeEstimatedRentValue: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { estimatedRentValue: null },
      })
    ),
  removeOccupancyRate: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { occupancyRate: null },
      })
    ),
  removeMOIC: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { moic: null },
      })
    ),
  removePrice: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { price: null },
      })
    ),
  removeTotalInvestment: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { totalInvestment: null },
      })
    ),
  removeProfitOnCost: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { profitOnCost: null },
      })
    ),
  removeProfit: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { profit: null },
      })
    ),
  removeSofCosts: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { sofCosts: null },
      })
    ),
  removeSellPerSqm: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { sellPerSqm: null },
      })
    ),
  removeGDV: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { gdv: null },
      })
    ),
  removeWAULT: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { wault: null },
      })
    ),
  removeDebtServiceCoverageRatio: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { debtServiceCoverageRatio: null },
      })
    ),
  removeExpectedExitYield: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { expectedExitYield: null },
      })
    ),
  removeLTV: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { ltv: null },
      })
    ),
  removeLTC: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { ltc: null },
      })
    ),
  removeYieldOnCost: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { yieldOnCost: null },
      })
    ),
  // Limited Partner Remove Mutations
  removeCoInvestment: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { coInvestment: null },
      })
    ),
  removeGPEquityValue: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { gpEquityValue: null },
      })
    ),
  removeGPEquityPercentage: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { gpEquityPercentage: null },
      })
    ),
  removeTotalEquityRequired: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { totalEquityRequired: null },
      })
    ),
  removeProjectIRR: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { projectIRR: null },
      })
    ),
  removeInvestorIRR: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { investorIRR: null },
      })
    ),
  removeCoInvestmentHoldPeriod: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { coInvestmentHoldPeriod: null },
      })
    ),
  removeCoInvestmentBreakEvenOccupancy: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { coInvestmentBreakEvenOccupancy: null },
      })
    ),
  removeSponsorPresentation: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { sponsorPresentation: null },
      })
    ),
  removePromoteStructure: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { promoteStructure: null },
      })
    ),
  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["ACTIVE", "INACTIVE", "CONCLUDED"]),
      })
    )
    .mutation(async ({ input }) => {
      const result = await prisma.realEstate.update({
        where: { id: input.id },
        data: { status: input.status },
      });

      // Trigger commission calculations when status changes to CONCLUDED
      if (input.status === "CONCLUDED") {
        await triggerCommissionCalculations(input.id, OpportunityType.REAL_ESTATE);
      }

      return result;
    }),
  updateFinalValues: adminProcedure
    .input(
      z.object({
        id: z.string(),
        final_amount: z.number().optional(),
        closed_at: z.date().optional(),
        invested_person_id: z.string().nullable().optional(),
        followup_person_id: z.string().nullable().optional(),
        profit_amount: z.number().optional(),
        commissionable_amount: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const updateData: {
        final_amount?: number;
        closed_at?: Date;
        invested_person_id?: string | null;
        followup_person_id?: string | null;
        profit_amount?: number;
        commissionable_amount?: number;
      } = {};
      
      if (input.final_amount !== undefined) updateData.final_amount = input.final_amount;
      if (input.closed_at !== undefined) updateData.closed_at = input.closed_at;
      if (input.invested_person_id !== undefined) updateData.invested_person_id = input.invested_person_id;
      if (input.followup_person_id !== undefined) updateData.followup_person_id = input.followup_person_id;
      if (input.profit_amount !== undefined) updateData.profit_amount = input.profit_amount;
      if (input.commissionable_amount !== undefined) updateData.commissionable_amount = input.commissionable_amount;

      const result = await prisma.opportunityAnalytics.update({
        where: { realEstateId: input.id },
        data: updateData,
      });

      // Trigger commission calculations when final values are updated
      // (in case opportunity was already CONCLUDED before final values were set)
      await triggerCommissionCalculations(input.id, OpportunityType.REAL_ESTATE);

      return result;
    }),
});
