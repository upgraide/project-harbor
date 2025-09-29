import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SubmitButton } from "@/components/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

const editOpportunityDescriptionSchema = z.object({
  description: z.string().min(3).max(1000),
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
      },
    );
    setOpportunity(null);
    form.reset();
  };

  return (
    <Dialog open={!!opportunity} onOpenChange={() => setOpportunity(null)}>
      <DialogContent className="p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 bg-sidebar border-b border-foreground/10">
          <DialogTitle>Edit Opportunity Description</DialogTitle>
          <DialogDescription>
            Edit the description of the opportunity.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 px-6 py-4 bg-background">
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
            <DialogFooter className="px-6 py-4 border-t border-foreground/10 bg-sidebar">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpportunity(null)}
                className="w-full"
              >
                Cancel
              </Button>
              <SubmitButton
                isSubmitting={form.formState.isSubmitting}
                size="lg"
                type="submit"
                className="w-full"
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
