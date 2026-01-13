"use client";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useScopedI18n } from "@/locales/client";

export const UserEditLoading = () => {
  const t = useScopedI18n("backoffice.users.userEdit");
  return <LoadingView message={t("loadingMessage")} />;
};

export const UserEditError = () => {
  const t = useScopedI18n("backoffice.users.userEdit");
  return <ErrorView message={t("errorMessage")} />;
};
