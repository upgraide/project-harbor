import { cookies } from "next/headers";
import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <AuthGuard>{children}</AuthGuard>;
};
