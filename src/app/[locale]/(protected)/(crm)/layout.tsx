import { ReactNode } from "react";
import { CrmSidebar } from "@/components/crm/crm-sidebar";
import { AppHeader } from "@/components/app-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireAdmin } from "@/lib/auth-utils";

const Layout = async ({ children }: { children: ReactNode }) => {
  const { user } = await requireAdmin();

  return (
    <SidebarProvider>
      <CrmSidebar />
      <SidebarInset className="bg-accent/20">
        <AppHeader
          user={{
            name: user.name,
            email: user.email,
            image: user.image ?? "",
          }}
        />
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
