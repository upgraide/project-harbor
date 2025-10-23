import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Role } from "@/generated/prisma";
import { backofficePath, dashboardPath, loginPath } from "@/paths";
import { caller } from "@/trpc/server";
import { auth } from "./auth";

export const requireAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(loginPath());
  }

  const role = await caller.users.getRole({ id: session.user.id });

  return { user: session.user, role };
};

export const requireUnAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect(dashboardPath());
  }

  return session;
};

const requireRole = async (
  allowedRoles: Role[],
  redirectPath: string = dashboardPath()
) => {
  const user = (await requireAuth()).user;
  const role = await caller.users.getRole({ id: user.id });

  if (!allowedRoles.includes(role)) {
    redirect(redirectPath);
  }

  return { user, role };
};

export const requireAdmin = () => requireRole([Role.ADMIN], backofficePath());

export const requireTeam = () => requireRole([Role.TEAM, Role.ADMIN]);
