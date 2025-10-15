"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import {
  useSuspenseOpportunity,
  useUpdateOpportunityName,
} from "@/features/opportunities/hooks/use-m&a-opportunities";
import { useScopedI18n } from "@/locales/client";
import { backofficeMergeAndAcquisitionPath } from "@/paths";

export const EditorBreadcrumbs = ({
  opportunityId,
}: {
  opportunityId: string;
}) => {
  const t = useScopedI18n("backoffice.mergersAndAcquisitionOpportunityPage");
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={backofficeMergeAndAcquisitionPath()}>
              {t("breadcrumb")}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <EditorNameInput opportunityId={opportunityId} />
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export const EditorNameInput = ({
  opportunityId,
}: {
  opportunityId: string;
}) => {
  const { data: opportunity } = useSuspenseOpportunity(opportunityId);
  const updateOpportunity = useUpdateOpportunityName();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(opportunity.name);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (opportunity.name) {
      setName(opportunity.name);
    }
  }, [opportunity.name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (name === opportunity.name) {
      setIsEditing(false);
      return;
    }

    try {
      await updateOpportunity.mutateAsync({ id: opportunityId, name });
      setIsEditing(false);
    } catch {
      setName(opportunity.name);
    } finally {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setName(opportunity.name);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        className="h-7 w-auto min-w-[100px] px-2"
        disabled={updateOpportunity.isPending}
        onBlur={handleSave}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        value={name}
      />
    );
  }

  return (
    <BreadcrumbItem
      className="cursor-pointer transition-colors hover:text-foreground"
      onClick={() => setIsEditing(true)}
    >
      {opportunity.name}
    </BreadcrumbItem>
  );
};

export const EditorHeader = ({ opportunityId }: { opportunityId: string }) => (
  <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
    <div className="flex w-full flex-row items-center justify-between gap-x-4">
      <EditorBreadcrumbs opportunityId={opportunityId} />
    </div>
  </header>
);
