import z from "zod";
import { PAGINATION } from "@/config/constants";
import {
  EbitdaRange,
  Industry,
  IndustrySubsector,
  RealEstateAssetType,
  RealEstateInvestmentType,
  SalesRange,
  Type,
  TypeDetails,
} from "@/generated/prisma";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { deleteFromUploadthing } from "@/lib/uploadthing-server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

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
      })
    )
    .mutation(async ({ ctx, input }) => {
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
        salesCAGR: parseOptionalFloat(input.salesCAGR),
        ebitdaCAGR: parseOptionalFloat(input.ebitdaCAGR),
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
      };

      // Create the opportunity
      const created = await prisma.mergerAndAcquisition.create({
        data,
      });

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
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.delete({
        where: { id: input.id },
      })
    ),
  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { name: input.name },
      })
    ),
  updateDescription: protectedProcedure
    .input(z.object({ id: z.string(), description: z.string().min(1) }))
    .mutation(async ({ input }) => {
      // Update the description in the database
      const updated = await prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { description: input.description },
      });

      // Trigger async translation to English via Inngest
      await inngest.send({
        name: "opportunity/translate-description",
        data: {
          opportunityId: input.id,
          description: input.description,
        },
      });

      return updated;
    }),
  updateType: protectedProcedure
    .input(z.object({ id: z.string(), type: z.enum(Type) }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { type: input.type },
      })
    ),
  removeType: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { type: null },
      })
    ),
  updateTypeDetails: protectedProcedure
    .input(z.object({ id: z.string(), typeDetails: z.enum(TypeDetails) }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { typeDetails: input.typeDetails },
      })
    ),
  removeTypeDetails: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { typeDetails: null },
      })
    ),
  updateIndustry: protectedProcedure
    .input(z.object({ id: z.string(), industry: z.enum(Industry) }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { industry: input.industry },
      })
    ),
  removeIndustry: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { industry: null },
      })
    ),
  updateIndustrySubsector: protectedProcedure
    .input(
      z.object({ id: z.string(), industrySubsector: z.enum(IndustrySubsector) })
    )
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { industrySubsector: input.industrySubsector },
      })
    ),
  removeIndustrySubsector: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { industrySubsector: null },
      })
    ),
  updateSales: protectedProcedure
    .input(z.object({ id: z.string(), sales: z.enum(SalesRange) }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { sales: input.sales },
      })
    ),
  removeSales: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { sales: null },
      })
    ),
  updateEbitda: protectedProcedure
    .input(z.object({ id: z.string(), ebitda: z.enum(EbitdaRange) }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { ebitda: input.ebitda },
      })
    ),
  removeEbitda: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { ebitda: null },
      })
    ),
  updateEbitdaNormalized: protectedProcedure
    .input(z.object({ id: z.string(), ebitdaNormalized: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { ebitdaNormalized: input.ebitdaNormalized },
      })
    ),
  removeEbitdaNormalized: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { ebitdaNormalized: null },
      })
    ),
  updateNetDebt: protectedProcedure
    .input(z.object({ id: z.string(), netDebt: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { netDebt: input.netDebt },
      })
    ),
  removeNetDebt: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { netDebt: null },
      })
    ),
  updateSalesCAGR: protectedProcedure
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
  removeSalesCAGR: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { salesCAGR: null },
      })
    ),
  updateEbitdaCAGR: protectedProcedure
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
  removeEbitdaCAGR: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { ebitdaCAGR: null },
      })
    ),
  updateAssetIncluded: protectedProcedure
    .input(z.object({ id: z.string(), assetIncluded: z.boolean() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { assetIncluded: input.assetIncluded },
      })
    ),
  removeAssetIncluded: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { assetIncluded: null },
      })
    ),
  updateEstimatedAssetValue: protectedProcedure
    .input(z.object({ id: z.string(), estimatedAssetValue: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { estimatedAssetValue: input.estimatedAssetValue },
      })
    ),
  removeEstimatedAssetValue: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { estimatedAssetValue: null },
      })
    ),
  updateGraphRows: protectedProcedure
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
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { graphRows: input.graphRows },
      })
    ),
  updateImages: protectedProcedure
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
  removeImage: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        imageUrl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await deleteFromUploadthing(input.imageUrl);
      return prisma.mergerAndAcquisition
        .findUniqueOrThrow({
          where: { id: input.id },
        })
        .then((opportunity) => {
          const updatedImages = (opportunity.images || []).filter(
            (img) => img !== input.imageUrl
          );
          return prisma.mergerAndAcquisition.update({
            where: { id: input.id },
            data: { images: updatedImages },
          });
        });
    }),
  updateIm: protectedProcedure
    .input(z.object({ id: z.string(), im: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { im: input.im },
      })
    ),
  removeIm: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { im: null },
      })
    ),
  updateEnterpriseValue: protectedProcedure
    .input(z.object({ id: z.string(), entrepriseValue: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { entrepriseValue: input.entrepriseValue },
      })
    ),
  removeEnterpriseValue: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { entrepriseValue: null },
      })
    ),
  updateEquityValue: protectedProcedure
    .input(z.object({ id: z.string(), equityValue: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { equityValue: input.equityValue },
      })
    ),
  removeEquityValue: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { equityValue: null },
      })
    ),
  updateEvDashEbitdaEntry: protectedProcedure
    .input(z.object({ id: z.string(), evDashEbitdaEntry: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { evDashEbitdaEntry: input.evDashEbitdaEntry },
      })
    ),
  removeEvDashEbitdaEntry: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { evDashEbitdaEntry: null },
      })
    ),
  updateEvDashEbitdaExit: protectedProcedure
    .input(z.object({ id: z.string(), evDashEbitdaExit: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { evDashEbitdaExit: input.evDashEbitdaExit },
      })
    ),
  removeEvDashEbitdaExit: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { evDashEbitdaExit: null },
      })
    ),
  updateEbitdaMargin: protectedProcedure
    .input(z.object({ id: z.string(), ebitdaMargin: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { ebitdaMargin: input.ebitdaMargin },
      })
    ),
  removeEbitdaMargin: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { ebitdaMargin: null },
      })
    ),
  updateFcf: protectedProcedure
    .input(z.object({ id: z.string(), fcf: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { fcf: input.fcf },
      })
    ),
  removeFcf: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { fcf: null },
      })
    ),
  updateNetDebtDashEbitda: protectedProcedure
    .input(z.object({ id: z.string(), netDebtDashEbitda: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { netDebtDashEbitda: input.netDebtDashEbitda },
      })
    ),
  removeNetDebtDashEbitda: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { netDebtDashEbitda: null },
      })
    ),
  updateCapexItensity: protectedProcedure
    .input(z.object({ id: z.string(), capexItensity: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { capexItensity: input.capexItensity },
      })
    ),
  removeCapexItensity: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { capexItensity: null },
      })
    ),
  updateWorkingCapitalNeeds: protectedProcedure
    .input(z.object({ id: z.string(), workingCapitalNeeds: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { workingCapitalNeeds: input.workingCapitalNeeds },
      })
    ),
  removeWorkingCapitalNeeds: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { workingCapitalNeeds: null },
      })
    ),
  updateCoInvestment: protectedProcedure
    .input(z.object({ id: z.string(), coInvestment: z.boolean() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { coInvestment: input.coInvestment },
      })
    ),
  removeCoInvestment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { coInvestment: null },
      })
    ),
  updateEquityContribution: protectedProcedure
    .input(z.object({ id: z.string(), equityContribution: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { equityContribution: input.equityContribution },
      })
    ),
  removeEquityContribution: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { equityContribution: null },
      })
    ),
  updateGrossIRR: protectedProcedure
    .input(z.object({ id: z.string(), grossIRR: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { grossIRR: input.grossIRR },
      })
    ),
  removeGrossIRR: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { grossIRR: null },
      })
    ),
  updateNetIRR: protectedProcedure
    .input(z.object({ id: z.string(), netIRR: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { netIRR: input.netIRR },
      })
    ),
  removeNetIRR: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { netIRR: null },
      })
    ),
  updateMoic: protectedProcedure
    .input(z.object({ id: z.string(), moic: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { moic: input.moic },
      })
    ),
  removeMoic: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { moic: null },
      })
    ),
  updateCashOnCashReturn: protectedProcedure
    .input(z.object({ id: z.string(), cashOnCashReturn: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { cashOnCashReturn: input.cashOnCashReturn },
      })
    ),
  removeCashOnCashReturn: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { cashOnCashReturn: null },
      })
    ),
  updateCashConvertion: protectedProcedure
    .input(z.object({ id: z.string(), cashConvertion: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { cashConvertion: input.cashConvertion },
      })
    ),
  removeCashConvertion: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { cashConvertion: null },
      })
    ),
  updateEntryMultiple: protectedProcedure
    .input(z.object({ id: z.string(), entryMultiple: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { entryMultiple: input.entryMultiple },
      })
    ),
  removeEntryMultiple: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { entryMultiple: null },
      })
    ),
  updateExitExpectedMultiple: protectedProcedure
    .input(z.object({ id: z.string(), exitExpectedMultiple: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { exitExpectedMultiple: input.exitExpectedMultiple },
      })
    ),
  removeExitExpectedMultiple: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { exitExpectedMultiple: null },
      })
    ),
  updateHoldPeriod: protectedProcedure
    .input(z.object({ id: z.string(), holdPeriod: z.number() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { holdPeriod: input.holdPeriod },
      })
    ),
  removeHoldPeriod: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { holdPeriod: null },
      })
    ),
  updateShareholderStructure: protectedProcedure
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
  removeShareholderStructure: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        imageUrl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await deleteFromUploadthing(input.imageUrl);
      return prisma.mergerAndAcquisition
        .findUniqueOrThrow({
          where: { id: input.id },
        })
        .then((opportunity) => {
          const updatedImages = (opportunity.shareholderStructure || []).filter(
            (img) => img !== input.imageUrl
          );
          return prisma.mergerAndAcquisition.update({
            where: { id: input.id },
            data: { shareholderStructure: updatedImages },
          });
        });
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) =>
      prisma.mergerAndAcquisition.findUniqueOrThrow({
        where: { id: input.id },
      })
    ),

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
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize, search } = input;
      const [items, totalCount] = await Promise.all([
        prisma.mergerAndAcquisition.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            name: { contains: search, mode: "insensitive" },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.mergerAndAcquisition.count({
          where: {
            name: { contains: search, mode: "insensitive" },
          },
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
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize, type, search } = input;

      // Build where conditions for M&A
      const mnaWhere = {
        name: { contains: search, mode: "insensitive" as const },
      };

      // Build where conditions for Real Estate
      const realEstateWhere = {
        name: { contains: search, mode: "insensitive" as const },
      };

      // Fetch data based on type filter
      let mnaItems: Array<{
        id: string;
        name: string;
        description: string | null;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
      }> = [];
      let realEstateItems: Array<{
        id: string;
        name: string;
        description: string | null;
        images: string[];
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
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              name: true,
              description: true,
              images: true,
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
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              name: true,
              description: true,
              images: true,
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

      // Sort by createdAt descending when showing all types
      if (type === "all") {
        items.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
      })
    )
    .mutation(({ ctx, input }) =>
      prisma.realEstate.create({
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
        },
      })
    ),
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
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize, search } = input;
      const [items, totalCount] = await Promise.all([
        prisma.realEstate.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            name: { contains: search, mode: "insensitive" },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.realEstate.count({
          where: {
            name: { contains: search, mode: "insensitive" },
          },
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
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.delete({
        where: { id: input.id },
      })
    ),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) =>
      prisma.realEstate.findUniqueOrThrow({
        where: { id: input.id },
      })
    ),
  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { name: input.name },
      })
    ),
  updateDescription: protectedProcedure
    .input(z.object({ id: z.string(), description: z.string().min(1) }))
    .mutation(async ({ input }) => {
      // Update the description in the database
      const updated = await prisma.realEstate.update({
        where: { id: input.id },
        data: { description: input.description },
      });

      // Trigger translation if description is provided
      if (input.description) {
        await inngest.send({
          name: "opportunity/translate-description",
          data: {
            opportunityId: updated.id,
            description: input.description,
          },
        });
      }

      return updated;
    }),
  updateImages: protectedProcedure
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
  removeImage: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        imageUrl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await deleteFromUploadthing(input.imageUrl);
      return prisma.realEstate
        .findUniqueOrThrow({
          where: { id: input.id },
        })
        .then((opportunity) => {
          const updatedImages = (opportunity.images || []).filter(
            (img) => img !== input.imageUrl
          );
          return prisma.realEstate.update({
            where: { id: input.id },
            data: { images: updatedImages },
          });
        });
    }),
  // Pre-NDA Update Mutations
  updateAsset: protectedProcedure
    .input(
      z.object({ id: z.string(), asset: z.nativeEnum(RealEstateAssetType) })
    )
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { asset: input.asset },
      })
    ),
  updateNRoomsLastYear: protectedProcedure
    .input(z.object({ id: z.string(), nRoomsLastYear: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { nRoomsLastYear: input.nRoomsLastYear },
      })
    ),
  updateNOI: protectedProcedure
    .input(z.object({ id: z.string(), noi: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { noi: input.noi },
      })
    ),
  updateOccupancyLastYear: protectedProcedure
    .input(z.object({ id: z.string(), occupancyLastYear: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { occupancyLastYear: input.occupancyLastYear },
      })
    ),
  updateWALT: protectedProcedure
    .input(z.object({ id: z.string(), walt: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { walt: input.walt },
      })
    ),
  updateNBeds: protectedProcedure
    .input(z.object({ id: z.string(), nBeds: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { nBeds: input.nBeds },
      })
    ),
  updateInvestment: protectedProcedure
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
  updateSubRent: protectedProcedure
    .input(z.object({ id: z.string(), subRent: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { subRent: input.subRent },
      })
    ),
  updateRentPerSqm: protectedProcedure
    .input(z.object({ id: z.string(), rentPerSqm: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { rentPerSqm: input.rentPerSqm },
      })
    ),
  updateSubYield: protectedProcedure
    .input(z.object({ id: z.string(), subYield: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { subYield: input.subYield },
      })
    ),
  updateCapex: protectedProcedure
    .input(z.object({ id: z.string(), capex: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { capex: input.capex },
      })
    ),
  updateCapexPerSqm: protectedProcedure
    .input(z.object({ id: z.string(), capexPerSqm: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { capexPerSqm: input.capexPerSqm },
      })
    ),
  updateSale: protectedProcedure
    .input(z.object({ id: z.string(), sale: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { sale: input.sale },
      })
    ),
  updateSalePerSqm: protectedProcedure
    .input(z.object({ id: z.string(), salePerSqm: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { salePerSqm: input.salePerSqm },
      })
    ),
  updateLocation: protectedProcedure
    .input(z.object({ id: z.string(), location: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { location: input.location },
      })
    ),
  updateArea: protectedProcedure
    .input(z.object({ id: z.string(), area: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { area: input.area },
      })
    ),
  updateValue: protectedProcedure
    .input(z.object({ id: z.string(), value: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { value: input.value },
      })
    ),
  updateYield: protectedProcedure
    .input(z.object({ id: z.string(), yield: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { yield: input.yield },
      })
    ),
  updateRent: protectedProcedure
    .input(z.object({ id: z.string(), rent: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { rent: input.rent },
      })
    ),
  updateGCAAboveGround: protectedProcedure
    .input(z.object({ id: z.string(), gcaAboveGround: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { gcaAboveGround: input.gcaAboveGround },
      })
    ),
  updateGCABelowGround: protectedProcedure
    .input(z.object({ id: z.string(), gcaBelowGround: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { gcaBelowGround: input.gcaBelowGround },
      })
    ),
  // Post-NDA Update Mutations
  updateLicense: protectedProcedure
    .input(z.object({ id: z.string(), license: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { license: input.license },
      })
    ),
  updateLicenseStage: protectedProcedure
    .input(z.object({ id: z.string(), licenseStage: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { licenseStage: input.licenseStage },
      })
    ),
  updateIRR: protectedProcedure
    .input(z.object({ id: z.string(), irr: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { irr: input.irr },
      })
    ),
  updateCOC: protectedProcedure
    .input(z.object({ id: z.string(), coc: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { coc: input.coc },
      })
    ),
  updateHoldingPeriod: protectedProcedure
    .input(z.object({ id: z.string(), holdingPeriod: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { holdingPeriod: input.holdingPeriod },
      })
    ),
  updateBreakEvenOccupancy: protectedProcedure
    .input(
      z.object({ id: z.string(), breakEvenOccupancy: z.number().nullable() })
    )
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { breakEvenOccupancy: input.breakEvenOccupancy },
      })
    ),
  updateVacancyRate: protectedProcedure
    .input(z.object({ id: z.string(), vacancyRate: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { vacancyRate: input.vacancyRate },
      })
    ),
  updateEstimatedRentValue: protectedProcedure
    .input(
      z.object({ id: z.string(), estimatedRentValue: z.number().nullable() })
    )
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { estimatedRentValue: input.estimatedRentValue },
      })
    ),
  updateOccupancyRate: protectedProcedure
    .input(z.object({ id: z.string(), occupancyRate: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { occupancyRate: input.occupancyRate },
      })
    ),
  updateMOIC: protectedProcedure
    .input(z.object({ id: z.string(), moic: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { moic: input.moic },
      })
    ),
  updatePrice: protectedProcedure
    .input(z.object({ id: z.string(), price: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { price: input.price },
      })
    ),
  updateTotalInvestment: protectedProcedure
    .input(z.object({ id: z.string(), totalInvestment: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { totalInvestment: input.totalInvestment },
      })
    ),
  updateProfitOnCost: protectedProcedure
    .input(z.object({ id: z.string(), profitOnCost: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { profitOnCost: input.profitOnCost },
      })
    ),
  updateProfit: protectedProcedure
    .input(z.object({ id: z.string(), profit: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { profit: input.profit },
      })
    ),
  updateSofCosts: protectedProcedure
    .input(z.object({ id: z.string(), sofCosts: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { sofCosts: input.sofCosts },
      })
    ),
  updateSellPerSqm: protectedProcedure
    .input(z.object({ id: z.string(), sellPerSqm: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { sellPerSqm: input.sellPerSqm },
      })
    ),
  updateGDV: protectedProcedure
    .input(z.object({ id: z.string(), gdv: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { gdv: input.gdv },
      })
    ),
  updateWAULT: protectedProcedure
    .input(z.object({ id: z.string(), wault: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { wault: input.wault },
      })
    ),
  updateDebtServiceCoverageRatio: protectedProcedure
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
  updateExpectedExitYield: protectedProcedure
    .input(z.object({ id: z.string(), expectedExitYield: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { expectedExitYield: input.expectedExitYield },
      })
    ),
  updateLTV: protectedProcedure
    .input(z.object({ id: z.string(), ltv: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { ltv: input.ltv },
      })
    ),
  updateLTC: protectedProcedure
    .input(z.object({ id: z.string(), ltc: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { ltc: input.ltc },
      })
    ),
  updateYieldOnCost: protectedProcedure
    .input(z.object({ id: z.string(), yieldOnCost: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { yieldOnCost: input.yieldOnCost },
      })
    ),
  // Limited Partner Update Mutations
  updateCoInvestment: protectedProcedure
    .input(z.object({ id: z.string(), coInvestment: z.boolean() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { coInvestment: input.coInvestment },
      })
    ),
  updateGPEquityValue: protectedProcedure
    .input(z.object({ id: z.string(), gpEquityValue: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { gpEquityValue: input.gpEquityValue },
      })
    ),
  updateGPEquityPercentage: protectedProcedure
    .input(
      z.object({ id: z.string(), gpEquityPercentage: z.number().nullable() })
    )
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { gpEquityPercentage: input.gpEquityPercentage },
      })
    ),
  updateTotalEquityRequired: protectedProcedure
    .input(
      z.object({ id: z.string(), totalEquityRequired: z.number().nullable() })
    )
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { totalEquityRequired: input.totalEquityRequired },
      })
    ),
  updateProjectIRR: protectedProcedure
    .input(z.object({ id: z.string(), projectIRR: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { projectIRR: input.projectIRR },
      })
    ),
  updateInvestorIRR: protectedProcedure
    .input(z.object({ id: z.string(), investorIRR: z.number() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { investorIRR: input.investorIRR },
      })
    ),
  updateCoInvestmentHoldPeriod: protectedProcedure
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
  updateCoInvestmentBreakEvenOccupancy: protectedProcedure
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
  updateSponsorPresentation: protectedProcedure
    .input(z.object({ id: z.string(), sponsorPresentation: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { sponsorPresentation: input.sponsorPresentation },
      })
    ),
  updatePromoteStructure: protectedProcedure
    .input(z.object({ id: z.string(), promoteStructure: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { promoteStructure: input.promoteStructure },
      })
    ),
  // Pre-NDA Remove Mutations
  removeAsset: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { asset: null },
      })
    ),
  removeNRoomsLastYear: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { nRoomsLastYear: null },
      })
    ),
  removeNOI: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { noi: null },
      })
    ),
  removeOccupancyLastYear: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { occupancyLastYear: null },
      })
    ),
  removeWALT: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { walt: null },
      })
    ),
  removeNBeds: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { nBeds: null },
      })
    ),
  removeInvestment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { investment: null },
      })
    ),
  removeSubRent: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { subRent: null },
      })
    ),
  removeRentPerSqm: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { rentPerSqm: null },
      })
    ),
  removeSubYield: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { subYield: null },
      })
    ),
  removeCapex: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { capex: null },
      })
    ),
  removeCapexPerSqm: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { capexPerSqm: null },
      })
    ),
  removeSale: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { sale: null },
      })
    ),
  removeSalePerSqm: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { salePerSqm: null },
      })
    ),
  removeLocation: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { location: null },
      })
    ),
  removeArea: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { area: null },
      })
    ),
  removeValue: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { value: null },
      })
    ),
  removeYield: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { yield: null },
      })
    ),
  removeRent: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { rent: null },
      })
    ),
  removeGCAAboveGround: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { gcaAboveGround: null },
      })
    ),
  removeGCABelowGround: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { gcaBelowGround: null },
      })
    ),
  // Post-NDA Remove Mutations
  removeLicense: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { license: null },
      })
    ),
  removeLicenseStage: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { licenseStage: null },
      })
    ),
  removeIRR: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { irr: null },
      })
    ),
  removeCOC: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { coc: null },
      })
    ),
  removeHoldingPeriod: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { holdingPeriod: null },
      })
    ),
  removeBreakEvenOccupancy: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { breakEvenOccupancy: null },
      })
    ),
  removeVacancyRate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { vacancyRate: null },
      })
    ),
  removeEstimatedRentValue: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { estimatedRentValue: null },
      })
    ),
  removeOccupancyRate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { occupancyRate: null },
      })
    ),
  removeMOIC: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { moic: null },
      })
    ),
  removePrice: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { price: null },
      })
    ),
  removeTotalInvestment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { totalInvestment: null },
      })
    ),
  removeProfitOnCost: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { profitOnCost: null },
      })
    ),
  removeProfit: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { profit: null },
      })
    ),
  removeSofCosts: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { sofCosts: null },
      })
    ),
  removeSellPerSqm: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { sellPerSqm: null },
      })
    ),
  removeGDV: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { gdv: null },
      })
    ),
  removeWAULT: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { wault: null },
      })
    ),
  removeDebtServiceCoverageRatio: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { debtServiceCoverageRatio: null },
      })
    ),
  removeExpectedExitYield: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { expectedExitYield: null },
      })
    ),
  removeLTV: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { ltv: null },
      })
    ),
  removeLTC: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { ltc: null },
      })
    ),
  removeYieldOnCost: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { yieldOnCost: null },
      })
    ),
  // Limited Partner Remove Mutations
  removeCoInvestment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { coInvestment: null },
      })
    ),
  removeGPEquityValue: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { gpEquityValue: null },
      })
    ),
  removeGPEquityPercentage: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { gpEquityPercentage: null },
      })
    ),
  removeTotalEquityRequired: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { totalEquityRequired: null },
      })
    ),
  removeProjectIRR: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { projectIRR: null },
      })
    ),
  removeInvestorIRR: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { investorIRR: null },
      })
    ),
  removeCoInvestmentHoldPeriod: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { coInvestmentHoldPeriod: null },
      })
    ),
  removeCoInvestmentBreakEvenOccupancy: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { coInvestmentBreakEvenOccupancy: null },
      })
    ),
  removeSponsorPresentation: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { sponsorPresentation: null },
      })
    ),
  removePromoteStructure: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.realEstate.update({
        where: { id: input.id },
        data: { promoteStructure: null },
      })
    ),
});
