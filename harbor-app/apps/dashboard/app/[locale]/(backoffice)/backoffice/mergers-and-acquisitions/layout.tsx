import { MergersAndAcquisitionsLayout } from "@/modules/backoffice/ui/layouts/mergers-and-acquisitions-layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <MergersAndAcquisitionsLayout>{children}</MergersAndAcquisitionsLayout>
  );
};

export default Layout;
