"use client";

import { EditIcon } from "lucide-react";
import { useState } from "react";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useSuspenseOpportunity,
  useUpdateOpportunityDescription,
} from "@/features/opportunities/hooks/use-m&a-opportunities";
import { useScopedI18n } from "@/locales/client";

export const EditorLoading = () => {
  const t = useScopedI18n("backoffice.mergersAndAcquisitionOpportunityPage");
  return <LoadingView message={t("loadingMessage")} />;
};

export const EditorError = () => {
  const t = useScopedI18n("backoffice.mergersAndAcquisitionOpportunityPage");
  return <ErrorView message={t("errorMessage")} />;
};

export const Editor = ({ opportunityId }: { opportunityId: string }) => {
  const t = useScopedI18n("backoffice.mergersAndAcquisitionOpportunityPage");
  const { data: opportunity } = useSuspenseOpportunity(opportunityId);
  const updateDescription = useUpdateOpportunityDescription();

  return (
    <>
      <p>{JSON.stringify(opportunity, null, 2)}</p>
      <main className="m-4 flex max-w-screen-xs flex-1 flex-col space-y-6 md:mx-auto md:max-w-screen-xl">
        <h1 className="font-bold text-2xl md:text-4xl">{opportunity.name}</h1>

        <section>
          <Card className="border-none bg-transparent shadow-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-bold text-lg">
                {t("description")}
              </CardTitle>
              <EditorEditButton
                cancelButtonText={t("cancelButtonText")}
                currentValue={opportunity.description || ""}
                fieldName="description"
                inputType="textarea"
                onSaveAction={async (value) => {
                  await updateDescription.mutateAsync({
                    id: opportunityId,
                    description: value,
                  });
                }}
                saveButtonText={t("saveButtonText")}
                title={t("editDescription")}
              />
            </CardHeader>
            <CardContent>
              <p className="text-balance text-base">
                {opportunity.description}
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="border-none bg-transparent shadow-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-bold text-lg">
                {t("financialInformationCard.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="px-6 py-4">
                      {t("financialInformationCard.table.header.metric")}
                    </TableHead>
                    <TableHead className="px-6 py-4">
                      {t("financialInformationCard.table.header.value")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
};

type EditorEditButtonInputType = "text" | "textarea";

type EditorEditButtonProps = {
  fieldName: string;
  title: string;
  cancelButtonText?: string;
  saveButtonText?: string;
  currentValue: string;
  onSaveAction: (value: string) => void | Promise<void>;
  inputType?: EditorEditButtonInputType;
  placeholder?: string;
  minHeight?: string;
};

export const EditorEditButton = ({
  fieldName,
  title,
  currentValue,
  onSaveAction,
  cancelButtonText = "Cancel",
  saveButtonText = "Save",
  inputType = "text",
  placeholder,
  minHeight = "min-h-32",
}: EditorEditButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedValue, setEditedValue] = useState(currentValue);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveAction(editedValue);
      setIsOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedValue(currentValue);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setEditedValue(currentValue);
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogTrigger asChild>
        <Button aria-label={title} size="icon" title={title} variant="outline">
          <EditIcon aria-hidden="true" className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {inputType === "textarea" ? (
            <Textarea
              aria-label={fieldName}
              className={minHeight}
              disabled={isSaving}
              onChange={(e) => setEditedValue(e.target.value)}
              placeholder={placeholder}
              value={editedValue}
            />
          ) : (
            <Input
              aria-label={fieldName}
              disabled={isSaving}
              onChange={(e) => setEditedValue(e.target.value)}
              placeholder={placeholder}
              value={editedValue}
            />
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button
            disabled={isSaving}
            onClick={handleCancel}
            type="button"
            variant="outline"
          >
            {cancelButtonText}
          </Button>
          <Button
            disabled={isSaving || editedValue === currentValue}
            onClick={handleSave}
            type="button"
          >
            {isSaving ? <Spinner className="mr-2" /> : saveButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
