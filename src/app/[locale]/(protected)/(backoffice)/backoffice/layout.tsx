import { AppHeader } from "@/components/app-header";
import { requireAuth } from "@/lib/auth-utils";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await requireAuth();

  return (
    <>
      <AppHeader
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image ?? "",
        }}
      />
      <main className="flex-1">{children}</main>
    </>
  );
};

export default Layout;
