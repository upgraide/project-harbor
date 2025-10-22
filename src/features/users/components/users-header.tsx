"use client";

import { useState } from "react";
import { EntityHeader } from "@/components/entity-components";
import { useScopedI18n } from "@/locales/client";
import { InviteUserDialog } from "./invite-user-dialog";

export const UsersHeader = ({ disabled }: { disabled?: boolean }) => {
  const t = useScopedI18n("backoffice.users");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  return (
    <>
      <EntityHeader
        description={t("description")}
        disabled={disabled}
        newButtonLabel={t("newButtonLabel")}
        onNew={() => setInviteDialogOpen(true)}
        title={t("title")}
      />
      <InviteUserDialog
        onOpenChangeAction={setInviteDialogOpen}
        open={inviteDialogOpen}
      />
    </>
  );
};
