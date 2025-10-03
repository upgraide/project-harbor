import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SubmitButton } from "@/components/submit-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

const DESCRIPTION_MIN_LENGTH = 3;
const DESCRIPTION_MAX_LENGTH = 1000;

const editOpportunityDescriptionSchema = z.object({
  description: z
    .string()
    .min(DESCRIPTION_MIN_LENGTH)
    .max(DESCRIPTION_MAX_LENGTH),
});

function EditOpportunityDescriptionDialog({
  opportunity,
  setOpportunity,
}: {
  opportunity: Doc<"mergersAndAcquisitions"> | null;
  setOpportunity: (opportunity: Doc<"mergersAndAcquisitions"> | null) => void;
}) {
  const updateOpportunity = useMutation(api.mergersAndAcquisitions.update);

  const form = useForm<z.infer<typeof editOpportunityDescriptionSchema>>({
    resolver: zodResolver(editOpportunityDescriptionSchema),
    defaultValues: {
      description: opportunity?.description ?? "",
    },
  });

  useEffect(() => {
    if (opportunity) {
      form.reset({
        description: opportunity.description ?? "",
      });
    }
  }, [opportunity, form]);

  const onSubmit = (data: z.infer<typeof editOpportunityDescriptionSchema>) => {
    if (!opportunity) {
      return;
    }
    toast.promise(
      updateOpportunity({
        id: opportunity._id,
        description: data.description,
      }),
      {
        loading: "Updating description",
        success: "Description updated successfully",
        error: "Failed to update description",
      }
    );
    setOpportunity(null);
    form.reset();
  };

  return (
    <Dialog onOpenChange={() => setOpportunity(null)} open={!!opportunity}>
      <DialogContent className="gap-0 overflow-hidden p-0">
        <DialogHeader className="border-foreground/10 border-b bg-sidebar p-6">
          <DialogTitle>Edit Opportunity Description</DialogTitle>
          <DialogDescription>
            Edit the description of the opportunity.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 bg-background px-6 py-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          maxLength={1000}
                          placeholder="Insert a value"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="border-foreground/10 border-t bg-sidebar px-6 py-4">
              <SubmitButton
                className="w-full"
                isSubmitting={form.formState.isSubmitting}
                size="lg"
                type="submit"
              >
                Update Description
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export { EditOpportunityDescriptionDialog };
