"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { StickyNote, Plus, Lock, Pencil } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Role } from "@/generated/prisma";
import { useTRPC } from "@/trpc/client";
import { useScopedI18n } from "@/locales/client";
import { useCurrentUserRole } from "@/features/users/hooks/use-current-user-role";
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
  const isTeamOrAdmin = currentUserRole === Role.TEAM || currentUserRole === Role.ADMIN;

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
                <CardDescription>
                  {t("description")}
                </CardDescription>
              </div>
              {isTeamOrAdmin && !isEditingPersonalNotes && (
                <Button onClick={handleEditPersonalNotes} size="sm" variant="outline">
                  <Pencil className="h-4 w-4 mr-2" />
                  {t("editButton")}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditingPersonalNotes ? (
              <div className="space-y-3">
                <Textarea
                  placeholder={t("placeholder")}
                  value={personalNotesText}
                  onChange={(e) => setPersonalNotesText(e.target.value)}
                  rows={6}
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingPersonalNotes(false);
                      setPersonalNotesText("");
                    }}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSavePersonalNotes}
                    disabled={updatePersonalNotes.isPending}
                  >
                    {updatePersonalNotes.isPending ? t("saving") : t("save")}
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {investor.personalNotes ? (
                  <p className="text-sm whitespace-pre-wrap">{investor.personalNotes}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">{t("empty")}</p>
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
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <div className="border rounded-lg p-4 bg-muted/50">
            <Textarea
              placeholder="Enter your note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
              className="mb-2"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setNewNote("");
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAddNote}
                disabled={!newNote.trim() || addNote.isPending}
              >
                {addNote.isPending ? "Adding..." : "Add Note"}
              </Button>
            </div>
          </div>
        )}

        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notes recorded</p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <p className="text-sm whitespace-pre-wrap">{note.note}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
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
