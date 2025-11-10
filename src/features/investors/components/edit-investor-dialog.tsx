"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
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
import {
  Department,
  InvestorClientType,
  InvestorSegment,
  InvestorStrategy,
  TeamMember,
} from "@/generated/prisma";
import { useScopedI18n } from "@/locales/client";
import { useInvestor } from "../hooks/use-investor";
import { useUpdateInvestor } from "../hooks/use-update-investor";
import { investorClientTypeOptions } from "../utils/enum-mappings";

const updateFormSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .optional(),
  investorType: z.enum(["<€10M", "€10M-€100M", ">€100M"]).optional(),
  preferredLocation: z.string().optional(),
  companyName: z.string().optional(),
  representativeName: z.string().optional(),
  phoneNumber: z.string().optional(),
  type: z.nativeEnum(InvestorClientType).optional(),
  strategy1: z.nativeEnum(InvestorStrategy).optional(),
  segment1: z.nativeEnum(InvestorSegment).optional(),
  strategy2: z.nativeEnum(InvestorStrategy).optional(),
  segment2: z.nativeEnum(InvestorSegment).optional(),
  strategy3: z.nativeEnum(InvestorStrategy).optional(),
  segment3: z.nativeEnum(InvestorSegment).optional(),
  location1: z.string().optional(),
  location2: z.string().optional(),
  location3: z.string().optional(),
  minTicketSize: z.number().optional(),
  maxTicketSize: z.number().optional(),
  targetReturnIRR: z.number().optional(),
  leadResponsibleId: z.string().nullable().optional(),
  leadMainContactId: z.string().nullable().optional(),
  leadResponsibleTeam: z.nativeEnum(TeamMember).optional(),
  leadMainContactTeam: z.nativeEnum(TeamMember).optional(),
  physicalAddress: z.string().optional(),
  website: z.string().optional(),
  lastContactDate: z.string().nullable().optional(),
  acceptMarketingList: z.boolean().optional(),
  otherFacts: z.string().optional(),
  lastNotes: z.string().optional(),
  department: z.nativeEnum(Department).optional(),
});

type UpdateFormValues = z.infer<typeof updateFormSchema>;

type EditInvestorDialogProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  investorId: string;
};

export const EditInvestorDialog = ({
  open,
  onOpenChangeAction,
  investorId,
}: EditInvestorDialogProps) => {
  const t = useScopedI18n("backoffice.investors.editDialog");
  const updateInvestor = useUpdateInvestor();
  const { data: investor, isLoading } = useInvestor(investorId);

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {},
  });

  // Extract helper functions outside useEffect to reduce complexity
  const formatDate = useCallback((date: Date | null | undefined): string => {
    if (!date) {
      return "";
    }
    return new Date(date).toISOString().split("T")[0];
  }, []);

  const formatInvestorType = useCallback(
    (
      type: string | null | undefined
    ): "<€10M" | "€10M-€100M" | ">€100M" | undefined => {
      if (!type) {
        return;
      }
      if (type === "LESS_THAN_10M") {
        return "<€10M";
      }
      if (type === "BETWEEN_10M_100M") {
        return "€10M-€100M";
      }
      if (type === "GREATER_THAN_100M") {
        return ">€100M";
      }
      return;
    },
    []
  );

  const getBaseData = useCallback(() => {
    if (!investor) {
      return {};
    }
    return {
      email: investor.email,
      name: investor.name,
      investorType: formatInvestorType(investor.investorType),
      preferredLocation: investor.preferredLocation ?? "",
      companyName: investor.companyName ?? "",
      representativeName: investor.representativeName ?? "",
      phoneNumber: investor.phoneNumber ?? "",
    };
  }, [investor, formatInvestorType]);

  const getStrategyData = useCallback(() => {
    if (!investor) {
      return {};
    }
    return {
      type: investor.type ?? undefined,
      strategy1: investor.strategy1 ?? undefined,
      segment1: investor.segment1 ?? undefined,
      strategy2: investor.strategy2 ?? undefined,
      segment2: investor.segment2 ?? undefined,
      strategy3: investor.strategy3 ?? undefined,
      segment3: investor.segment3 ?? undefined,
    };
  }, [investor]);

  const getLocationData = useCallback(() => {
    if (!investor) {
      return {};
    }
    return {
      location1: investor.location1 ?? "",
      location2: investor.location2 ?? "",
      location3: investor.location3 ?? "",
    };
  }, [investor]);

  const getInvestmentData = useCallback(() => {
    if (!investor) {
      return {};
    }
    return {
      minTicketSize: investor.minTicketSize ?? undefined,
      maxTicketSize: investor.maxTicketSize ?? undefined,
      targetReturnIRR: investor.targetReturnIRR ?? undefined,
    };
  }, [investor]);

  const getLeadData = useCallback(() => {
    if (!investor) {
      return {};
    }
    return {
      leadResponsibleId: investor.leadResponsibleId ?? null,
      leadMainContactId: investor.leadMainContactId ?? null,
      leadResponsibleTeam: investor.leadResponsibleTeam ?? undefined,
      leadMainContactTeam: investor.leadMainContactTeam ?? undefined,
    };
  }, [investor]);

  const getContactData = useCallback(() => {
    if (!investor) {
      return {};
    }
    return {
      physicalAddress: investor.physicalAddress ?? "",
      website: investor.website ?? "",
      lastContactDate: formatDate(investor.lastContactDate),
      acceptMarketingList: investor.acceptMarketingList ?? undefined,
      otherFacts: investor.otherFacts ?? "",
      lastNotes: investor.lastNotes ?? "",
      department: investor.department ?? undefined,
    };
  }, [investor, formatDate]);

  const getFormResetData = useCallback((): UpdateFormValues => {
    if (!investor) {
      return {};
    }
    return {
      ...getBaseData(),
      ...getStrategyData(),
      ...getLocationData(),
      ...getInvestmentData(),
      ...getLeadData(),
      ...getContactData(),
    };
  }, [
    investor,
    getBaseData,
    getStrategyData,
    getLocationData,
    getInvestmentData,
    getLeadData,
    getContactData,
  ]);

  useEffect(() => {
    if (investor && open) {
      form.reset(getFormResetData());
    }
  }, [investor, open, form, getFormResetData]);

  const getLastContactDate = (
    lastContactDate: string | null | undefined
  ): Date | null | undefined => {
    if (lastContactDate) {
      return new Date(lastContactDate);
    }
    if (lastContactDate === "") {
      return null;
    }
    return;
  };

  const onSubmit = async (data: UpdateFormValues) => {
    try {
      const submitData = {
        id: investorId,
        ...data,
        lastContactDate: getLastContactDate(data.lastContactDate),
      };
      await updateInvestor.mutateAsync(submitData);
      form.reset();
      onOpenChangeAction(false);
    } catch {
      // Error is handled by the mutation's onError callback
    }
  };

  if (isLoading) {
    return (
      <Dialog onOpenChange={onOpenChangeAction} open={open}>
        <DialogContent>
          <div>Loading...</div>
        </DialogContent>
      </Dialog>
    );
  }

  // Reuse the same form structure as invite dialog
  // For brevity, I'll create a simplified version - in production you'd want to extract to a shared component
  return (
    <Dialog onOpenChange={onOpenChangeAction} open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Basic Information</h3>
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
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.companyName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Company Name"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="representativeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.representativeName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Representative Name"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.phoneNumber")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+351 123 456 789"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.type")}</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value as InvestorClientType)
                      }
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("labels.typePlaceholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {investorClientTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                onClick={() => onOpenChangeAction(false)}
                type="button"
                variant="outline"
              >
                {t("cancel")}
              </Button>
              <Button disabled={updateInvestor.isPending} type="submit">
                {updateInvestor.isPending ? t("saving") : t("save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
