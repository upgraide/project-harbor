import { BackofficeLayout } from "@/modules/backoffice/ui/layouts/backoffice-layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <BackofficeLayout>{children}</BackofficeLayout>;
};

export default Layout;
