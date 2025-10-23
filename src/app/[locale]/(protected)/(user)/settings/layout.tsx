import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Navigation } from "@/features/dashboard/components/header";
import { requireAuth } from "@/lib/auth-utils";
import { cn } from "@/lib/utils";
import { getScopedI18n } from "@/locales/server";
import { dashboardSettingsPath } from "@/paths";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = (await requireAuth()).user;
  const t = await getScopedI18n("dashboard.settings");
  return (
    <>
      <Navigation
        user={{
          name: user.name,
          email: user.email,
          image: user.image ?? "",
        }}
      />
      <main className="flex-1">
        <div className="flex h-full w-full px-6 py-8">
          <div className="mx-auto flex h-full w-full max-w-screen-xl gap-12">
            <div className="hidden w-full max-w-64 flex-col gap-0.5 lg:flex">
              <Link
                className={cn(
                  `${buttonVariants({ variant: "ghost" })}`,
                  "justify-start rounded-md"
                )}
                href={dashboardSettingsPath()}
              >
                <span className={cn("text-sm")}>
                  {t("updateProfileCard.title")}
                </span>
              </Link>
            </div>
            {children}
          </div>
        </div>
      </main>
    </>
  );
};

export default Layout;
