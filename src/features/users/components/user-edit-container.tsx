"use client";

import type { ReactNode } from "react";
import { useScopedI18n } from "@/locales/client";

type UserEditContainerProps = {
  children: ReactNode;
};

export const UserEditContainer = ({ children }: UserEditContainerProps) => {
  const t = useScopedI18n("backoffice.users.userEdit");

  return (
    <main className="flex max-w-screen-xs flex-1 flex-col space-y-6 px-6 py-4 md:mx-auto md:max-w-screen-xl md:px-4">
      <div className="space-y-2">
        <h1 className="font-bold text-2xl md:text-4xl">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      {children}
    </main>
  );
};
