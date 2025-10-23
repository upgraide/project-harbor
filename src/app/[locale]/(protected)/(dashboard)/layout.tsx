import { Navigation } from "@/features/dashboard/components/header";
import { requireAuth } from "@/lib/auth-utils";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const { user, role } = await requireAuth();
  return (
    <>
      <Navigation
        user={{
          name: user.name,
          email: user.email,
          image: user.image ?? "",
          role,
        }}
      />
      <main className="flex-1">{children}</main>
    </>
  );
};

export default Layout;
