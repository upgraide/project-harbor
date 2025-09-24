import { BackofficeSidebarMergersAndAcquisitions } from "@/modules/backoffice/ui/components/backoffice-sidebar-mergers-and-acquisitions";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <BackofficeSidebarMergersAndAcquisitions />
      {children}
    </>
  );
};

export default Layout;
