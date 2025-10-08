import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
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

const addOpportunityGraphRowSchema = z.object({
  year: z.string().min(YEAR_MIN_LENGTH, { message: "Year must be 4 digits" }),
  revenue: z.number(),
  ebitda: z.number(),
  ebitdaMargin: z.number(),
});

function AddOpportunityGraphRowDialog({
  opportunity,
  setOpportunity,
}: {
  opportunity: Doc<"mergersAndAcquisitions"> | null;
  setOpportunity: (opportunity: Doc<"mergersAndAcquisitions"> | null) => void;
}) {
  const updateOpportunity = useMutation(api.mergersAndAcquisitions.update);

  const form = useForm<z.infer<typeof addOpportunityGraphRowSchema>>({
    resolver: zodResolver(addOpportunityGraphRowSchema),
    defaultValues: {},
  });

  const onSubmit = (data: z.infer<typeof addOpportunityGraphRowSchema>) => {
    if (!opportunity) {
      return;
    }
    toast.promise(
      updateOpportunity({
        id: opportunity._id,
        graphRows: [
          ...(opportunity.graphRows ?? []),
          {
            year: data.year,
            revenue: data.revenue,
            ebitda: data.ebitda,
            ebitdaMargin: data.ebitdaMargin,
          },
        ],
      }),
      {
        loading: "Updating graph row",
        success: "Graph row updated successfully",
        error: "Failed to update graph row",
      }
    );
    setOpportunity(null);
    form.reset();
  };

  return (
    <Dialog onOpenChange={() => setOpportunity(null)} open={!!opportunity}>
      <DialogContent className="gap-0 overflow-hidden p-0">
        <DialogHeader className="border-foreground/10 border-b bg-sidebar p-6">
          <DialogTitle>Add Opportunity Graph Row</DialogTitle>
          <DialogDescription>
            Add a new graph row to the opportunity.
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
                <FormField
                  control={form.control}
                  name="ebitdaMargin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>EBITDA Margin</FormLabel>
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

export { AddOpportunityGraphRowDialog };
