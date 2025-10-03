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
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

const YEAR_MIN_LENGTH = 4;

export const editOpportunityGraphRowSchema = z.object({
  year: z
    .string()
    .min(YEAR_MIN_LENGTH, { message: "Year must be 4 digits long" }),
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
    graphRow: z.infer<typeof editOpportunityGraphRowSchema> | null
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
            : row
        ),
      }),
      {
        loading: "Updating graph row",
        success: "Graph row updated successfully",
        error: "Failed to update graph row",
      }
    );
    setOpportunity(null);
    setGraphRow(null);
    form.reset();
  };

  return (
    <Dialog
      onOpenChange={() => {
        setOpportunity(null);
        setGraphRow(null);
      }}
      open={!!opportunity}
    >
      <DialogContent className="gap-0 overflow-hidden p-0">
        <DialogHeader className="border-foreground/10 border-b bg-sidebar p-6">
          <DialogTitle>Edit Opportunity Graph Row</DialogTitle>
          <DialogDescription>
            Edit the graph row of the opportunity.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 bg-background px-6 py-4">
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
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? undefined : Number(value)
                            );
                          }}
                          value={field.value || ""}
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
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? undefined : Number(value)
                            );
                          }}
                          value={field.value || ""}
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
