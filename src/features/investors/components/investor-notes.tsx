"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { StickyNote, Plus } from "lucide-react";
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
import { useTRPC } from "@/trpc/client";
import { useAddInvestorNote } from "../hooks/use-add-investor-note";

type InvestorNotesProps = {
  investorId: string;
};

export const InvestorNotes = ({ investorId }: InvestorNotesProps) => {
  const trpc = useTRPC();
  const [newNote, setNewNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const { data: notes } = useSuspenseQuery(
    trpc.investors.getNotes.queryOptions({ userId: investorId })
  );

  const addNote = useAddInvestorNote(investorId);

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

  return (
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
  );
};
