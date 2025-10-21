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

  return session;
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

export const requireAdmin = async () => {
  const user = (await requireAuth()).user;
  const role = await caller.users.getRole({ id: user.id });

  if (role !== Role.ADMIN) {
    redirect(backofficePath());
  }

  return role;
};

export const requireTeam = async () => {
  const user = (await requireAuth()).user;
  const role = await caller.users.getRole({ id: user.id });
  if (role !== Role.TEAM) {
    redirect(dashboardPath());
  }
  return { user, role };
};
