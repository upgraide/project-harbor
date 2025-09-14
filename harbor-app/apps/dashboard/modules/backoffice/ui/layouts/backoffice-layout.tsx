import { SidebarProvider } from "@harbor-app/ui/components/sidebar";
import { cookies } from "next/headers";

export const BackofficeLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar-state")?.value === "true";

  return (
    <SidebarProvider>
      <main className="flex flex-1 flex-col">{children}</main>
    </SidebarProvider>
  );
};
