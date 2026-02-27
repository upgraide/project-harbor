import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";
import { CrmSidebar } from "@/components/crm/crm-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireAdmin } from "@/lib/auth-utils";

const Layout = async ({ children }: { children: ReactNode }) => {
  const { user, role } = await requireAdmin();

  return (
    <SidebarProvider>
      <CrmSidebar />
      <SidebarInset className="bg-accent/20">
        <AppHeader
          user={{
            name: user.name,
            email: user.email,
            image: user.image ?? "",
            role,
          }}
        />
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
