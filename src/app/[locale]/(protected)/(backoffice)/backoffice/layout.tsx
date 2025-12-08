import { ReactNode } from "react";
import ClientI18nLayout from "./client-i18n-layout";
import { requireTeam } from "@/lib/auth-utils";

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { user } = await requireTeam();

  return (
    <ClientI18nLayout locale={locale} user={{ ...user, image: user.image ?? null }}>
      {children}
    </ClientI18nLayout>
  );
}
