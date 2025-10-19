import { ErrorView, LoadingView } from "@/components/entity-components";
import { useScopedI18n } from "@/locales/client";

export const UsersLoading = () => <LoadingView />;

export const UsersError = () => {
  const t = useScopedI18n("backoffice.users");
  return <ErrorView message={t("errorMessage")} />;
};
