import { CrmSidebar } from "@/components/crm/crm-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <CrmSidebar />
    <SidebarInset className="bg-accent/20">{children}</SidebarInset>
  </SidebarProvider>
);

export default Layout;
