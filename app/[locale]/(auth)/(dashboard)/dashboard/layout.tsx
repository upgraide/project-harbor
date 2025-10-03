import { DashboardLayout } from "@/modules/dashboard/ui/layouts/dashboard-layout";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <DashboardLayout>{children}</DashboardLayout>
);

export default Layout;
