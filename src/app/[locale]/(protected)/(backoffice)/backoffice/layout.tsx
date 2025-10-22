import { AppHeader } from "@/components/app-header";
import { requireTeam } from "@/lib/auth-utils";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const { user } = await requireTeam();

  return (
    <>
      <AppHeader
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
