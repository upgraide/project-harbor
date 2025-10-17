"use client";

import { EditIcon, EllipsisVerticalIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useRemoveOpportunityType,
  useRemoveOpportunityTypeDetails,
  useSuspenseOpportunity,
  useUpdateOpportunityDescription,
  useUpdateOpportunityType,
  useUpdateOpportunityTypeDetails,
} from "@/features/opportunities/hooks/use-m&a-opportunities";
import { Type, TypeDetails } from "@/generated/prisma";
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
  const updateType = useUpdateOpportunityType();
  const updateTypeDetails = useUpdateOpportunityTypeDetails();

  const removeType = useRemoveOpportunityType();
  const removeTypeDetails = useRemoveOpportunityTypeDetails();
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
                    <TableHead className="px-6 py-4 text-right">
                      {t("financialInformationCard.table.header.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow key={"type"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.body.type.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.type
                        ? t(
                            `financialInformationCard.table.body.type.values.${opportunity.type}`
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="outline">
                            <EllipsisVerticalIcon className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-12 min-w-10 space-y-1"
                        >
                          <DropdownMenuItem asChild>
                            <EditorEditButton
                              cancelButtonText={t("cancelButtonText")}
                              currentValue={opportunity.type ?? ""}
                              description={t(
                                "financialInformationCard.table.body.type.description"
                              )}
                              fieldName="type"
                              inputType="select"
                              onSaveAction={async (value) => {
                                await updateType.mutateAsync({
                                  id: opportunityId,
                                  type: value as Type,
                                });
                              }}
                              options={[
                                {
                                  label: t(
                                    "financialInformationCard.table.body.type.values.BUY_IN"
                                  ),
                                  value: Type.BUY_IN,
                                },
                                {
                                  label: t(
                                    "financialInformationCard.table.body.type.values.BUY_OUT"
                                  ),
                                  value: Type.BUY_OUT,
                                },
                                {
                                  label: t(
                                    "financialInformationCard.table.body.type.values.BUY_IN_BUY_OUT"
                                  ),
                                  value: Type.BUY_IN_BUY_OUT,
                                },
                              ]}
                              placeholder={t(
                                "financialInformationCard.table.body.type.placeholder"
                              )}
                              saveButtonText={t("saveButtonText")}
                              title={t(
                                "financialInformationCard.table.body.type.label"
                              )}
                            />
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Button
                              disabled={opportunity.type === null}
                              onClick={async () => {
                                await removeType.mutateAsync({
                                  id: opportunityId,
                                });
                              }}
                              size="icon"
                              variant="destructive"
                            >
                              <TrashIcon className="size-4 text-destructive" />
                            </Button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  <TableRow key={"typeDetails"}>
                    <TableCell className="px-6 py-4">
                      {t(
                        "financialInformationCard.table.body.typeDetails.label"
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.typeDetails
                        ? t(
                            `financialInformationCard.table.body.typeDetails.values.${opportunity.typeDetails}`
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="outline">
                            <EllipsisVerticalIcon className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-12 min-w-10 space-y-1"
                        >
                          <DropdownMenuItem asChild>
                            <EditorEditButton
                              cancelButtonText={t("cancelButtonText")}
                              currentValue={opportunity.typeDetails ?? ""}
                              description={t(
                                "financialInformationCard.table.body.typeDetails.description"
                              )}
                              fieldName="type"
                              inputType="select"
                              onSaveAction={async (value) => {
                                await updateTypeDetails.mutateAsync({
                                  id: opportunityId,
                                  typeDetails: value as TypeDetails,
                                });
                              }}
                              options={[
                                {
                                  label: t(
                                    "financialInformationCard.table.body.typeDetails.values.MAIORITARIO"
                                  ),
                                  value: TypeDetails.MAIORITARIO,
                                },
                                {
                                  label: t(
                                    "financialInformationCard.table.body.typeDetails.values.MINORITARIO"
                                  ),
                                  value: TypeDetails.MINORITARIO,
                                },
                                {
                                  label: t(
                                    "financialInformationCard.table.body.typeDetails.values.FULL_OWNERSHIP"
                                  ),
                                  value: TypeDetails.FULL_OWNERSHIP,
                                },
                              ]}
                              placeholder={t(
                                "financialInformationCard.table.body.typeDetails.placeholder"
                              )}
                              saveButtonText={t("saveButtonText")}
                              title={t(
                                "financialInformationCard.table.body.typeDetails.label"
                              )}
                            />
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Button
                              disabled={opportunity.typeDetails === null}
                              onClick={async () => {
                                await removeTypeDetails.mutateAsync({
                                  id: opportunityId,
                                });
                              }}
                              size="icon"
                              variant="destructive"
                            >
                              <TrashIcon className="size-4 text-destructive" />
                            </Button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
};

type EditorEditButtonInputType = "text" | "textarea";
type SelectOption = {
  label: string;
  value: string;
};

type EditorEditButtonProps = {
  fieldName: string;
  title: string;
  cancelButtonText?: string;
  saveButtonText?: string;
  currentValue: string;
  onSaveAction: (value: string) => void | Promise<void>;
  inputType?: EditorEditButtonInputType | "select";
  placeholder?: string;
  description?: string;
  minHeight?: string;
  options?: SelectOption[];
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
  description,
  minHeight = "min-h-32",
  options,
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

  const renderInput = () => {
    if (inputType === "textarea") {
      return (
        <Textarea
          aria-label={fieldName}
          className={minHeight}
          disabled={isSaving}
          onChange={(e) => setEditedValue(e.target.value)}
          placeholder={placeholder}
          value={editedValue}
        />
      );
    }

    if (inputType === "select") {
      return (
        <Select
          onValueChange={(value) => setEditedValue(value)}
          value={editedValue}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        aria-label={fieldName}
        disabled={isSaving}
        onChange={(e) => setEditedValue(e.target.value)}
        placeholder={placeholder}
        value={editedValue}
      />
    );
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
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">{renderInput()}</div>
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
