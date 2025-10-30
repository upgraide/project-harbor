import { z } from "zod";
import prisma from "@/lib/db";
import { sendAccessRequestNotification } from "@/lib/pusher";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 100;
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 1000;
const MIN_PAGE_SIZE = 1;
const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

// E.164 phone format regex - defined at top level for performance
const E164_PHONE_REGEX = /^\+[1-9]\d{1,14}$/;

const createRequestAccessSchema = () =>
  z.object({
    name: z.string().min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH),
    email: z.string().email(),
    company: z.string().min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH),
    phone: z.string().regex(E164_PHONE_REGEX), // E.164 format
    position: z.string().min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH),
    message: z.string().min(MIN_MESSAGE_LENGTH).max(MAX_MESSAGE_LENGTH),
  });

export const accessRequestRouter = createTRPCRouter({
  create: baseProcedure
    .input(createRequestAccessSchema())
    .mutation(async ({ input }) => {
      const accessRequest = await prisma.accessRequest.create({
        data: {
          name: input.name,
          email: input.email,
          company: input.company,
          phone: input.phone,
          position: input.position,
          message: input.message,
        },
      });

      // Send Pusher notification to admin users
      await sendAccessRequestNotification({
        accessRequestId: accessRequest.id,
        name: accessRequest.name,
        email: accessRequest.email,
        company: accessRequest.company,
      });

      return {
        success: true,
        id: accessRequest.id,
      };
    }),

  getMany: baseProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize, status } = input;

      const where = status ? { status } : {};

      const [items, totalCount] = await Promise.all([
        prisma.accessRequest.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.accessRequest.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    }),

  updateStatus: baseProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
      })
    )
    .mutation(async ({ input }) => {
      const accessRequest = await prisma.accessRequest.update({
        where: { id: input.id },
        data: { status: input.status },
      });

      return accessRequest;
    }),
});
