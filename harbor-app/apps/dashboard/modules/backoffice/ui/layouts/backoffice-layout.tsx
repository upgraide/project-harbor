import { SidebarProvider } from "@harbor-app/ui/components/sidebar";
import { Provider } from "jotai";
import { cookies } from "next/headers";
import { BackofficeSidebar } from "../components/backoffice-sidebar";

export const BackofficeLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar-state")?.value === "true";

  return (
    <Provider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <BackofficeSidebar />
        <main className="flex flex-1 flex-col">{children}</main>
      </SidebarProvider>
    </Provider>
  );
};
