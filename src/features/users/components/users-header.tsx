"use client";

import { EntityHeader } from "@/components/entity-components";
import { useScopedI18n } from "@/locales/client";

export const UsersHeader = ({ disabled }: { disabled?: boolean }) => {
  const t = useScopedI18n("backoffice.users");

  return (
    <EntityHeader
      description={t("description")}
      disabled={disabled}
      newButtonLabel={t("newButtonLabel")}
      title={t("title")}
    />
  );
};
