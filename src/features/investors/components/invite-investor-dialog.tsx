"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useScopedI18n } from "@/locales/client";
import { useInviteInvestor } from "../hooks/use-invite-investor";

const inviteFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  investorType: z.enum(["<€10M", "€10M-€100M", ">€100M"]).optional(),
  preferredLocation: z.string().optional(),
  language: z.enum(["en", "pt"]),
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

type InviteInvestorDialogProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

export const InviteInvestorDialog = ({
  open,
  onOpenChangeAction,
}: InviteInvestorDialogProps) => {
  const t = useScopedI18n("backoffice.investors.inviteDialog");
  const inviteInvestor = useInviteInvestor();

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
      name: "",
      investorType: undefined,
      preferredLocation: "",
      language: "en",
    },
  });

  const onSubmit = async (data: InviteFormValues) => {
    await inviteInvestor.mutateAsync(data);
    if (!inviteInvestor.isPending) {
      form.reset();
      onOpenChangeAction(false);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChangeAction} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("labels.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("labels.email")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="investorType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("labels.investorType")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("labels.investorTypePlaceholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="<€10M">
                        {t("investorTypes.<€10M")}
                      </SelectItem>
                      <SelectItem value="€10M-€100M">
                        {t("investorTypes.€10M-€100M")}
                      </SelectItem>
                      <SelectItem value=">€100M">
                        {t("investorTypes.>€100M")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("labels.preferredLocation")}</FormLabel>
                  <FormControl>
                    <Input placeholder="Lisbon, Portugal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("labels.language")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="en">
                        {t("languages.english")}
                      </SelectItem>
                      <SelectItem value="pt">
                        {t("languages.portuguese")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                onClick={() => onOpenChangeAction(false)}
                type="button"
                variant="outline"
              >
                {t("cancel")}
              </Button>
              <Button disabled={inviteInvestor.isPending} type="submit">
                {inviteInvestor.isPending ? t("sending") : t("send")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
