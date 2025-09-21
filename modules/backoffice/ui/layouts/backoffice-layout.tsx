import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";

const BackofficeLayout = ({ children }: { children: React.ReactNode }) => {
  return <AuthGuard>{children}</AuthGuard>;
};

export default BackofficeLayout;
