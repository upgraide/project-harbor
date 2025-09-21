import { api } from "@/convex/_generated/api";
import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import { preloadQuery } from "convex/nextjs";
import { getToken } from "@/lib/auth-server";
import { Navigation } from "@/modules/dashboard/ui/components/navigation";

export const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const token = await getToken();
  const preloadedUser = await preloadQuery(
    api.auth.getCurrentUser,
    {},
    { token },
  );

  return (
    <AuthGuard>
      <Navigation preloadedUser={preloadedUser} />
      {children}
    </AuthGuard>
  );
};
