"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Lock, Pencil, Plus, StickyNote } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUserRole } from "@/features/users/hooks/use-current-user-role";
import { Role } from "@/generated/prisma";
import { useScopedI18n } from "@/locales/client";
import { useTRPC } from "@/trpc/client";
import { useAddInvestorNote } from "../hooks/use-add-investor-note";
import { useUpdatePersonalNotes } from "../hooks/use-update-personal-notes";

type InvestorNotesProps = {
  investorId: string;
};

export const InvestorNotes = ({ investorId }: InvestorNotesProps) => {
  const trpc = useTRPC();
  const t = useScopedI18n("backoffice.investors.detail.personalNotes");
  const [newNote, setNewNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditingPersonalNotes, setIsEditingPersonalNotes] = useState(false);
  const [personalNotesText, setPersonalNotesText] = useState("");

  const { data: notes } = useSuspenseQuery(
    trpc.investors.getNotes.queryOptions({ userId: investorId })
  );

  const { data: investor } = useSuspenseQuery(
    trpc.investors.getOne.queryOptions({ id: investorId })
  );

  const { data: currentUserRole } = useCurrentUserRole();
  const isAdmin = currentUserRole === Role.ADMIN;
  const isTeamOrAdmin =
    currentUserRole === Role.TEAM || currentUserRole === Role.ADMIN;

  const addNote = useAddInvestorNote(investorId);
  const updatePersonalNotes = useUpdatePersonalNotes(investorId);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      await addNote.mutateAsync({
        userId: investorId,
        note: newNote,
      });
      setNewNote("");
      setIsAdding(false);
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  const handleSavePersonalNotes = async () => {
    try {
      await updatePersonalNotes.mutateAsync({
        userId: investorId,
        personalNotes: personalNotesText || null,
      });
      setIsEditingPersonalNotes(false);
    } catch (error) {
      console.error("Failed to update personal notes:", error);
    }
  };

  const handleEditPersonalNotes = () => {
    setPersonalNotesText(investor.personalNotes || "");
    setIsEditingPersonalNotes(true);
  };

  return (
    <div className="space-y-6">
      {/* Personal Notes Section - Visible to Team/Admin */}
      {isTeamOrAdmin && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  {t("title")}
                </CardTitle>
                <CardDescription>{t("description")}</CardDescription>
              </div>
              {isTeamOrAdmin && !isEditingPersonalNotes && (
                <Button
                  onClick={handleEditPersonalNotes}
                  size="sm"
                  variant="outline"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  {t("editButton")}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditingPersonalNotes ? (
              <div className="space-y-3">
                <Textarea
                  onChange={(e) => setPersonalNotesText(e.target.value)}
                  placeholder={t("placeholder")}
                  rows={6}
                  value={personalNotesText}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => {
                      setIsEditingPersonalNotes(false);
                      setPersonalNotesText("");
                    }}
                    size="sm"
                    variant="outline"
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    disabled={updatePersonalNotes.isPending}
                    onClick={handleSavePersonalNotes}
                    size="sm"
                  >
                    {updatePersonalNotes.isPending ? t("saving") : t("save")}
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {investor.personalNotes ? (
                  <p className="whitespace-pre-wrap text-sm">
                    {investor.personalNotes}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm italic">
                    {t("empty")}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Regular Notes Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <StickyNote className="h-5 w-5" />
                Notes ({notes.length})
              </CardTitle>
              <CardDescription>
                Internal notes and observations about this investor
              </CardDescription>
            </div>
            {!isAdding && (
              <Button onClick={() => setIsAdding(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAdding && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <Textarea
                className="mb-2"
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note..."
                rows={3}
                value={newNote}
              />
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => {
                    setIsAdding(false);
                    setNewNote("");
                  }}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  disabled={!newNote.trim() || addNote.isPending}
                  onClick={handleAddNote}
                  size="sm"
                >
                  {addNote.isPending ? "Adding..." : "Add Note"}
                </Button>
              </div>
            </div>
          )}

          {notes.length === 0 ? (
            <p className="text-muted-foreground text-sm">No notes recorded</p>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  key={note.id}
                >
                  <p className="whitespace-pre-wrap text-sm">{note.note}</p>
                  <div className="mt-2 flex items-center gap-2 text-muted-foreground text-xs">
                    <span>By {note.createdByUser.name}</span>
                    <span>•</span>
                    <span>{format(new Date(note.createdAt), "PPp")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
