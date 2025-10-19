import z from "zod";
import { PAGINATION } from "@/config/constants";
import {
  EbitdaRange,
  Industry,
  IndustrySubsector,
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
