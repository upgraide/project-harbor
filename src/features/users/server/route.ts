import { headers } from "next/headers";
import { z } from "zod";
import { PAGINATION, PASSWORD } from "@/config/constants";
import { Role } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { sendInviteEmail } from "@/lib/emails/send-invite";
import { generatePassword } from "@/lib/generate-password";
import { deleteFromUploadthing } from "@/lib/uploadthing-server";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { updateProfileSchema } from "../schemas/update-profile-schema";

export const usersRouter = createTRPCRouter({
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
        prisma.user.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            disabled: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.user.count({
          where: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      type User = (typeof items)[number];
      const formattedItems = items.map((user: User) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: !user.disabled,
      }));

      return {
        items: formattedItems,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

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

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        role: z.nativeEnum(Role).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      
      const currentUser = ctx.auth;
      if (!currentUser) {
        throw new Error("Unauthorized");
      }

      // Get current user's role
      const caller = await prisma.user.findUnique({
        where: { id: currentUser.user.id },
        select: { role: true },
      });

      // Get target user's role
      const targetUser = await prisma.user.findUnique({
        where: { id: input.id },
        select: { role: true },
      });

      if (!caller || !targetUser) {
        throw new Error("User not found");
      }

      // Only admins can change roles
      if (data.role && caller.role !== Role.ADMIN) {
        throw new Error("Only admins can change user roles");
      }

      // Team members can only edit USER role users
      if (caller.role === Role.TEAM && targetUser.role !== Role.USER) {
        throw new Error("Team members can only edit regular users");
      }

      // Regular users can't edit anyone
      if (caller.role === Role.USER) {
        throw new Error("Insufficient permissions");
      }
      
      // Check if email is being changed and if it's already in use
      if (data.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: data.email },
        });
        
        if (existingUser && existingUser.id !== id) {
          throw new Error("Email is already in use");
        }
      }
      
      const user = await prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
      
      return user;
    }),

  deactivate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const currentUser = ctx.auth;
      if (!currentUser) {
        throw new Error("Unauthorized");
      }

      // Get current user's role
      const caller = await prisma.user.findUnique({
        where: { id: currentUser.user.id },
        select: { role: true },
      });

      // Get target user's role
      const targetUser = await prisma.user.findUnique({
        where: { id: input.id },
        select: { role: true },
      });

      if (!caller || !targetUser) {
        throw new Error("User not found");
      }

      // Check permissions: Admin can deactivate anyone, Team can deactivate USER only
      if (caller.role === Role.TEAM && targetUser.role !== Role.USER) {
        throw new Error("Insufficient permissions");
      }

      if (caller.role === Role.USER) {
        throw new Error("Insufficient permissions");
      }

      // Deactivate by setting disabled flag and expiring all sessions
      await Promise.all([
        prisma.user.update({
          where: { id: input.id },
          data: { disabled: true },
        }),
        prisma.session.updateMany({
          where: { userId: input.id },
          data: { expiresAt: new Date() },
        }),
      ]);

      return { success: true };
    }),

  activate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const currentUser = ctx.auth;
      if (!currentUser) {
        throw new Error("Unauthorized");
      }

      // Get current user's role
      const caller = await prisma.user.findUnique({
        where: { id: currentUser.user.id },
        select: { role: true },
      });

      // Get target user's role
      const targetUser = await prisma.user.findUnique({
        where: { id: input.id },
        select: { role: true },
      });

      if (!caller || !targetUser) {
        throw new Error("User not found");
      }

      // Check permissions: Admin can activate anyone, Team can activate USER only
      if (caller.role === Role.TEAM && targetUser.role !== Role.USER) {
        throw new Error("Insufficient permissions");
      }

      if (caller.role === Role.USER) {
        throw new Error("Insufficient permissions");
      }

      // Activate by removing the disabled flag
      await prisma.user.update({
        where: { id: input.id },
        data: { disabled: false },
      });

      return { success: true, message: "User can now log in again" };
    }),

  invite: protectedProcedure
    .input(
      z.object({
        email: z.email().min(1),
        name: z.string().min(1),
        language: z.enum(["en", "pt"]).default("en"),
      })
    )
    .mutation(async ({ input }) => {
      const { email, name, language } = input;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

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
          throw new Error(`Failed to invite user: ${error.message}`);
        }
        throw error;
      }
    }),
  getRole: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { id: input.id },
      });
      if (!user) {
        throw new Error("User not found");
      }
      return user.role;
    }),

  getTeamAndAdminUsers: protectedProcedure.query(async () => {
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: [Role.TEAM, Role.ADMIN],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return users;
  }),

  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ input, ctx }) => {
      const user = await prisma.user.update({
        where: { id: ctx.auth.user.id },
        data: {
          name: input.name,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      return user;
    }),

  updateAvatar: protectedProcedure
    .input(
      z.object({
        image: z.string().nullable(),
        oldImage: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Delete old image from uploadthing if it exists
      if (input.oldImage) {
        await deleteFromUploadthing(input.oldImage);
      }

      const user = await prisma.user.update({
        where: { id: ctx.auth.user.id },
        data: {
          image: input.image,
        },
        select: {
          id: true,
          image: true,
        },
      });
      return user;
    }),

  deleteUploadedFile: protectedProcedure
    .input(z.object({ fileUrl: z.string() }))
    .mutation(async ({ input }) => {
      const success = await deleteFromUploadthing(input.fileUrl);

      if (!success) {
        throw new Error("Failed to delete file from uploadthing");
      }

      return { success: true };
    }),

  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(PASSWORD.MIN_LENGTH),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { currentPassword, newPassword } = input;

      // Change password using Better Auth
      await auth.api.changePassword({
        body: {
          currentPassword,
          newPassword,
        },
        headers: await headers(),
      });

      // Update passwordChanged flag in database
      await prisma.user.update({
        where: { id: ctx.auth.user.id },
        data: {
          passwordChanged: true,
        },
      });

      return { success: true };
    }),

  getPasswordChangedStatus: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: { id: ctx.auth.user.id },
      select: {
        passwordChanged: true,
      },
    });

    return { passwordChanged: user?.passwordChanged ?? false };
  }),
});
