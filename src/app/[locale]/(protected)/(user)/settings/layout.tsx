import { Navigation } from "@/features/dashboard/components/header";
import { requireAuth } from "@/lib/auth-utils";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = (await requireAuth()).user;
  return (
    <>
      <Navigation
        user={{
          name: user.name,
          email: user.email,
          image: user.image ?? "",
        }}
      />
      <main className="flex-1">{children}</main>
    </>
  );
};

export default Layout;
