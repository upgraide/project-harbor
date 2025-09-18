import { SidebarProvider } from "@harbor-app/ui/components/sidebar";
import { Provider } from "jotai";
import { cookies } from "next/headers";
import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import { BackofficeSidebar } from "../components/backoffice-sidebar";

export const BackofficeLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const cookieStore = await cookies();
  const sidebarCookie = cookieStore.get("sidebar_state");
  const defaultOpen = sidebarCookie?.value === "true";

  return (
    <AuthGuard>
      <Provider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <BackofficeSidebar />
          <main className="flex flex-1 flex-col">{children}</main>
        </SidebarProvider>
      </Provider>
    </AuthGuard>
  );
};
