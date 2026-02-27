"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, Pencil, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { UserSelect } from "@/features/users/components/user-select";
import { useScopedI18n } from "@/locales/client";
import { useTRPC } from "@/trpc/client";

type InvestorLastFollowUpsProps = {
  investorId: string;
};

type FollowUpFormData = {
  followUpDate: string;
  description: string;
  contactedById: string;
  personContactedId: string;
};

export const InvestorLastFollowUps = ({
  investorId,
}: InvestorLastFollowUpsProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const t = useScopedI18n("backoffice.investors.detail.lastFollowUps");

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFollowUpId, setSelectedFollowUpId] = useState<string | null>(
    null
  );

  const [formData, setFormData] = useState<FollowUpFormData>({
    followUpDate: new Date().toISOString().split("T")[0],
    description: "",
    contactedById: "",
    personContactedId: investorId,
  });

  const { data: followUps, isLoading } = useQuery(
    trpc.investors.getFollowUps.queryOptions({ userId: investorId })
  );

  const addFollowUp = useMutation(
    trpc.investors.addFollowUp.mutationOptions({
      onSuccess: () => {
        toast.success("Follow-up added successfully");
        queryClient.invalidateQueries(
          trpc.investors.getFollowUps.queryOptions({ userId: investorId })
        );
        queryClient.invalidateQueries(
          trpc.investors.getOne.queryOptions({ id: investorId })
        );
        resetForm();
        setAddDialogOpen(false);
      },
      onError: () => {
        toast.error("Failed to add follow-up");
      },
    })
  );

  const updateFollowUp = useMutation(
    trpc.investors.updateFollowUp.mutationOptions({
      onSuccess: () => {
        toast.success("Follow-up updated successfully");
        queryClient.invalidateQueries(
          trpc.investors.getFollowUps.queryOptions({ userId: investorId })
        );
        resetForm();
        setEditDialogOpen(false);
        setSelectedFollowUpId(null);
      },
      onError: () => {
        toast.error("Failed to update follow-up");
      },
    })
  );

  const deleteFollowUp = useMutation(
    trpc.investors.deleteFollowUp.mutationOptions({
      onSuccess: () => {
        toast.success("Follow-up deleted successfully");
        queryClient.invalidateQueries(
          trpc.investors.getFollowUps.queryOptions({ userId: investorId })
        );
        setDeleteDialogOpen(false);
        setSelectedFollowUpId(null);
      },
      onError: () => {
        toast.error("Failed to delete follow-up");
      },
    })
  );

  const resetForm = () => {
    setFormData({
      followUpDate: new Date().toISOString().split("T")[0],
      description: "",
      contactedById: "",
      personContactedId: investorId,
    });
  };

  const handleAdd = () => {
    if (
      !(
        formData.followUpDate &&
        formData.description &&
        formData.contactedById &&
        formData.personContactedId
      )
    ) {
      toast.error(t("validation.descriptionRequired"));
      return;
    }

    addFollowUp.mutate({
      userId: investorId,
      followUpDate: new Date(formData.followUpDate),
      description: formData.description,
      contactedById: formData.contactedById,
      personContactedId: formData.personContactedId,
    });
  };

  const handleEdit = () => {
    if (
      !(
        selectedFollowUpId &&
        formData.followUpDate &&
        formData.description &&
        formData.contactedById &&
        formData.personContactedId
      )
    ) {
      toast.error(t("validation.descriptionRequired"));
      return;
    }

    updateFollowUp.mutate({
      id: selectedFollowUpId,
      followUpDate: new Date(formData.followUpDate),
      description: formData.description,
      contactedById: formData.contactedById,
      personContactedId: formData.personContactedId,
    });
  };

  const handleDelete = () => {
    if (!selectedFollowUpId) return;
    deleteFollowUp.mutate({ id: selectedFollowUpId });
  };

  const openEditDialog = (followUpId: string) => {
    if (!followUps) return;
    const followUp = followUps.find((f: any) => f.id === followUpId);
    if (followUp) {
      setFormData({
        followUpDate: new Date(followUp.followUpDate)
          .toISOString()
          .split("T")[0],
        description: followUp.description,
        contactedById: followUp.contactedById,
        personContactedId: followUp.personContactedId,
      });
      setSelectedFollowUpId(followUpId);
      setEditDialogOpen(true);
    }
  };

  const openDeleteDialog = (followUpId: string) => {
    setSelectedFollowUpId(followUpId);
    setDeleteDialogOpen(true);
  };
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t("title")}
          </CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!followUps) {
    return null;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t("title")} ({followUps.length})
              </CardTitle>
              <CardDescription>{t("description")}</CardDescription>
            </div>
            <Button onClick={() => setAddDialogOpen(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              {t("addButton")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {followUps.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground text-sm">
              {t("empty")}
            </p>
          ) : (
            <div className="space-y-4">
              {followUps.map((followUp: any) => (
                <div
                  className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  key={followUp.id}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {format(new Date(followUp.followUpDate), "PPP")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => openEditDialog(followUp.id)}
                        size="sm"
                        variant="ghost"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => openDeleteDialog(followUp.id)}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="mb-3 whitespace-pre-wrap text-sm">
                    {followUp.description}
                  </p>
                  <div className="flex items-center gap-4 text-muted-foreground text-xs">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>
                        {t("contactedBy")}: {followUp.contactedBy.name}
                      </span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <span>
                        {t("personContacted")}: {followUp.personContacted.name}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-muted-foreground text-xs">
                    {t("createdAt")}:{" "}
                    {format(new Date(followUp.createdAt), "PPp")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog onOpenChange={setAddDialogOpen} open={addDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("addDialog.title")}</DialogTitle>
            <DialogDescription>{t("addDialog.description")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="add-date">{t("labels.followUpDate")}</Label>
              <Input
                id="add-date"
                onChange={(e) =>
                  setFormData({ ...formData, followUpDate: e.target.value })
                }
                type="date"
                value={formData.followUpDate}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="add-contacted-by">
                {t("labels.contactedBy")}
              </Label>
              <UserSelect
                onValueChange={(value: string) =>
                  setFormData({ ...formData, contactedById: value })
                }
                placeholder={t("labels.selectPerson")}
                value={formData.contactedById}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="add-person-contacted">
                {t("labels.personContacted")}
              </Label>
              <Input
                className="bg-muted"
                disabled
                id="add-person-contacted"
                value={investorId}
              />
              <p className="text-muted-foreground text-xs">
                This field is automatically set to the current client/investor
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="add-description">{t("labels.description")}</Label>
              <Textarea
                id="add-description"
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder={t("labels.descriptionPlaceholder")}
                rows={6}
                value={formData.description}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                resetForm();
                setAddDialogOpen(false);
              }}
              variant="outline"
            >
              {t("addDialog.cancel")}
            </Button>
            <Button disabled={addFollowUp.isPending} onClick={handleAdd}>
              {addFollowUp.isPending
                ? t("addDialog.saving")
                : t("addDialog.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog onOpenChange={setEditDialogOpen} open={editDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("editDialog.title")}</DialogTitle>
            <DialogDescription>{t("editDialog.description")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-date">{t("labels.followUpDate")}</Label>
              <Input
                id="edit-date"
                onChange={(e) =>
                  setFormData({ ...formData, followUpDate: e.target.value })
                }
                type="date"
                value={formData.followUpDate}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-contacted-by">
                {t("labels.contactedBy")}
              </Label>
              <UserSelect
                onValueChange={(value: string) =>
                  setFormData({ ...formData, contactedById: value })
                }
                placeholder={t("labels.selectPerson")}
                value={formData.contactedById}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-person-contacted">
                {t("labels.personContacted")}
              </Label>
              <Input
                className="bg-muted"
                disabled
                id="edit-person-contacted"
                value={investorId}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description">
                {t("labels.description")}
              </Label>
              <Textarea
                id="edit-description"
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder={t("labels.descriptionPlaceholder")}
                rows={6}
                value={formData.description}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                resetForm();
                setEditDialogOpen(false);
                setSelectedFollowUpId(null);
              }}
              variant="outline"
            >
              {t("editDialog.cancel")}
            </Button>
            <Button disabled={updateFollowUp.isPending} onClick={handleEdit}>
              {updateFollowUp.isPending
                ? t("editDialog.saving")
                : t("editDialog.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedFollowUpId(null)}>
              {t("deleteDialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              {t("deleteDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
