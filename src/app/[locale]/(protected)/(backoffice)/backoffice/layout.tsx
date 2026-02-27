import type { ReactNode } from "react";
import { requireTeam } from "@/lib/auth-utils";
import ClientI18nLayout from "./client-i18n-layout";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { user, role } = await requireTeam();

  return (
    <ClientI18nLayout
      locale={locale}
      user={{ ...user, image: user.image ?? null, role }}
    >
      {children}
    </ClientI18nLayout>
  );
}
