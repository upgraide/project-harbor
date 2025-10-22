import { AuthLayout } from "@/features/auth/components/auth-layout";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <AuthLayout>{children}</AuthLayout>
);

export default Layout;
