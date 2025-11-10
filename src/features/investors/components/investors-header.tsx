"use client";

import { useState } from "react";
import { EntityHeader } from "@/components/entity-components";
import { useScopedI18n } from "@/locales/client";
import { InviteInvestorDialog } from "./invite-investor-dialog";

export const InvestorsHeader = ({ disabled }: { disabled?: boolean }) => {
  const t = useScopedI18n("backoffice.investors");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  return (
    <>
      <EntityHeader
        description={t("description")}
        disabled={disabled}
        newButtonLabel={t("addNewInvestor")}
        onNew={() => setInviteDialogOpen(true)}
        title={t("title")}
      />
      <InviteInvestorDialog
        onOpenChangeAction={setInviteDialogOpen}
        open={inviteDialogOpen}
      />
    </>
  );
};
