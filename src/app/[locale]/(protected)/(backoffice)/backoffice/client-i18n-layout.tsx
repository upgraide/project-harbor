"use client";

import { AppHeader } from "@/components/app-header";
import { SidebarInset } from "@/components/ui/sidebar";
import type { Role } from "@/generated/prisma";
import { I18nProviderClient } from "@/locales/client";

export default function ClientI18nLayout({
  children,
  locale,
  user,
}: {
  children: React.ReactNode;
  locale: string;
  user: { name: string; email: string; image: string | null; role?: Role };
}) {
  return (
    <I18nProviderClient locale={locale}>
      <SidebarInset className="bg-accent/20">
        <AppHeader
          user={{
            name: user.name,
            email: user.email,
            image: user.image ?? "",
            role: user.role,
          }}
        />
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </I18nProviderClient>
  );
}
