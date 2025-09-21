import { BackofficeSidebar } from "@/modules/backoffice/ui/components/backoffice-sidebar";
import BackofficeLayout from "@/modules/backoffice/ui/layouts/backoffice-layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <BackofficeLayout>
      <BackofficeSidebar />
      {children}
    </BackofficeLayout>
  );
};

export default Layout;
