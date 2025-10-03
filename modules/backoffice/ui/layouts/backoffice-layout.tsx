import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";

const BackofficeLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <AuthGuard>
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      {children}
    </SidebarProvider>
  </AuthGuard>
);

export default BackofficeLayout;
