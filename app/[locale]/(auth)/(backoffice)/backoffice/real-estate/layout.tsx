import { BackofficeSidebarRealEstate } from "@/modules/backoffice/ui/components/backoffice-sidebar-real-estate";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <BackofficeSidebarRealEstate />
      {children}
    </>
  );
};

export default Layout;
