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
import { toast } from "sonner";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";

export const editOpportunityGraphRowSchema = z.object({
  year: z.string().min(4, { message: "Year must be 4 digits" }),
  revenue: z.number().min(0, { message: "Revenue must be greater than 0" }),
  ebitda: z.number().min(0, { message: "EBITDA must be greater than 0" }),
});

function EditOpportunityGraphRowDialog({
  opportunity,
  graphRow,
  setOpportunity,
  setGraphRow,
}: {
  opportunity: Doc<"mergersAndAcquisitions"> | null;
  graphRow: z.infer<typeof editOpportunityGraphRowSchema> | null;
  setOpportunity: (opportunity: Doc<"mergersAndAcquisitions"> | null) => void;
  setGraphRow: (
    graphRow: z.infer<typeof editOpportunityGraphRowSchema> | null,
  ) => void;
}) {
  const updateOpportunity = useMutation(api.mergersAndAcquisitions.update);

  const form = useForm<z.infer<typeof editOpportunityGraphRowSchema>>({
    resolver: zodResolver(editOpportunityGraphRowSchema),
    defaultValues: {
      year: "",
      revenue: 0,
      ebitda: 0,
    },
  });

  useEffect(() => {
    if (graphRow) {
      form.reset({
        year: graphRow.year,
        revenue: graphRow.revenue,
        ebitda: graphRow.ebitda,
      });
    }
  }, [graphRow, form]);

  const onSubmit = (data: z.infer<typeof editOpportunityGraphRowSchema>) => {
    if (!opportunity) {
      return;
    }
    if (!graphRow) {
      return;
    }
    toast.promise(
      updateOpportunity({
        id: opportunity._id,
        graphRows: (opportunity.graphRows ?? []).map((row) =>
          row.year === graphRow.year
            ? {
                year: data.year,
                revenue: data.revenue,
                ebitda: data.ebitda,
              }
            : row,
        ),
      }),
      {
        loading: "Updating graph row",
        success: "Graph row updated successfully",
        error: "Failed to update graph row",
      },
    );
    setOpportunity(null);
    setGraphRow(null);
    form.reset();
  };

  return (
    <Dialog
      open={!!opportunity}
      onOpenChange={() => {
        setOpportunity(null);
        setGraphRow(null);
      }}
    >
      <DialogContent className="p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 bg-sidebar border-b border-foreground/10">
          <DialogTitle>Edit Opportunity Graph Row</DialogTitle>
          <DialogDescription>
            Edit the graph row of the opportunity.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 px-6 py-4 bg-background">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Insert a value"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="revenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Revenue</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Insert a value"
                          type="number"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? undefined : Number(value),
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ebitda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>EBITDA</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Insert a value"
                          type="number"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? undefined : Number(value),
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="px-6 py-4 border-t border-foreground/10 bg-sidebar">
              <SubmitButton
                isSubmitting={form.formState.isSubmitting}
                size="lg"
                type="submit"
                className="w-full"
              >
                Add Graph Row
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export { EditOpportunityGraphRowDialog };
