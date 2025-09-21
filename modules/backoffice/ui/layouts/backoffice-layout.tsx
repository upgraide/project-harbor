import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import { cookies } from "next/headers";

const BackofficeLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const cookieStore = await cookies();
  const sidebarCookie = cookieStore.get("sidebar_state");
  const defaultOpen = sidebarCookie?.value === "true";

  return (
    <AuthGuard>
      <SidebarProvider defaultOpen={defaultOpen}>{children}</SidebarProvider>
    </AuthGuard>
  );
};

export default BackofficeLayout;
