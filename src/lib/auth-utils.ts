import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { dashboardPath, loginPath } from "@/paths";
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
