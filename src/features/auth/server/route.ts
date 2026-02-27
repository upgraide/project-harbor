import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { notifyAdmins } from "@/features/notifications/server/notifications";
import { NotificationType } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { sendInviteEmail } from "@/lib/emails/send-invite";
import { generatePassword } from "@/lib/generate-password";
import { sendAccessRequestNotification } from "@/lib/pusher";
import {
  baseProcedure,
  createTRPCRouter,
  teamOrAdminProcedure,
} from "@/trpc/init";

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

      // Create persistent DB notifications for admins
      await notifyAdmins({
        type: NotificationType.ACCESS_REQUEST,
        title: "New access request",
        message: `${accessRequest.name} from ${accessRequest.company} (${accessRequest.email}) requested access`,
      });

      return {
        success: true,
        id: accessRequest.id,
      };
    }),

  getMany: teamOrAdminProcedure
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

  approve: teamOrAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const accessRequest = await prisma.accessRequest.findUnique({
        where: { id: input.id },
      });

      if (!accessRequest) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Access request not found",
        });
      }

      // Check if user with this email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: accessRequest.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A user with this email already exists",
        });
      }

      const generatedPassword = generatePassword();

      // Send invite email BEFORE creating the user so a failed email
      // doesn't leave an orphaned user record.
      await sendInviteEmail({
        userEmail: accessRequest.email,
        password: generatedPassword,
        language: "pt",
      });

      // Create user via Better Auth
      const newUser = await auth.api.signUpEmail({
        body: {
          name: accessRequest.name,
          email: accessRequest.email,
          password: generatedPassword,
        },
      });

      if (!newUser.user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
        });
      }

      // Update user with mapped fields from access request
      await prisma.user.update({
        where: { id: newUser.user.id },
        data: {
          companyName: accessRequest.company,
          phoneNumber: accessRequest.phone,
        },
      });

      // Delete the access request
      await prisma.accessRequest.delete({
        where: { id: input.id },
      });

      return {
        success: true,
        user: {
          id: newUser.user.id,
          email: newUser.user.email,
          name: newUser.user.name,
        },
      };
    }),

  reject: teamOrAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.accessRequest.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
