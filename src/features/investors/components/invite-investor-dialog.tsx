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
import { Textarea } from "@/components/ui/textarea";
import { useTeamAndAdminUsers } from "@/features/users/hooks/use-team-and-admin-users";
import {
  Department,
  InvestorClientType,
  InvestorSegment,
  InvestorStrategy,
  TeamMember,
} from "@/generated/prisma";
import { useScopedI18n } from "@/locales/client";
import { useInviteInvestor } from "../hooks/use-invite-investor";
import {
  departmentOptions,
  investorClientTypeOptions,
  investorSegmentOptions,
  investorStrategyOptions,
  teamMemberOptions,
} from "../utils/enum-mappings";

const inviteFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  investorType: z.enum(["<€10M", "€10M-€100M", ">€100M"]).optional(),
  preferredLocation: z.string().optional(),
  language: z.enum(["en", "pt"]),
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
  leadResponsibleId: z.string().optional(),
  leadMainContactId: z.string().optional(),
  leadResponsibleTeam: z.nativeEnum(TeamMember).optional(),
  leadMainContactTeam: z.nativeEnum(TeamMember).optional(),
  physicalAddress: z.string().optional(),
  website: z.string().optional(),
  lastContactDate: z.string().optional(),
  acceptMarketingList: z.boolean().optional(),
  otherFacts: z.string().optional(),
  lastNotes: z.string().optional(),
  department: z.nativeEnum(Department).optional(),
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

type InviteInvestorDialogProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

const STRATEGY_SEGMENT_COUNT = 3;
const LOCATION_COUNT = 3;

export const InviteInvestorDialog = ({
  open,
  onOpenChangeAction,
}: InviteInvestorDialogProps) => {
  const t = useScopedI18n("backoffice.investors.inviteDialog");
  const inviteInvestor = useInviteInvestor();
  const { data: teamUsers } = useTeamAndAdminUsers();

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
      name: "",
      investorType: undefined,
      preferredLocation: "",
      language: "en",
      companyName: "",
      representativeName: "",
      phoneNumber: "",
      type: undefined,
      strategy1: undefined,
      segment1: undefined,
      strategy2: undefined,
      segment2: undefined,
      strategy3: undefined,
      segment3: undefined,
      location1: "",
      location2: "",
      location3: "",
      minTicketSize: undefined,
      maxTicketSize: undefined,
      targetReturnIRR: undefined,
      leadResponsibleId: undefined,
      leadMainContactId: undefined,
      leadResponsibleTeam: undefined,
      leadMainContactTeam: undefined,
      physicalAddress: "",
      website: "",
      lastContactDate: "",
      acceptMarketingList: undefined,
      otherFacts: "",
      lastNotes: "",
      department: undefined,
    },
  });

  const onSubmit = async (data: InviteFormValues) => {
    try {
      const submitData = {
        ...data,
        lastContactDate: data.lastContactDate
          ? new Date(data.lastContactDate)
          : undefined,
      };
      await inviteInvestor.mutateAsync(submitData);
      form.reset();
      onOpenChangeAction(false);
    } catch {
      // Error is handled by the mutation's onError callback
    }
  };

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
                      <Input placeholder="Company Name" {...field} />
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
                      <Input placeholder="Representative Name" {...field} />
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
                      <Input placeholder="+351 123 456 789" {...field} />
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
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.department")}</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value as Department)
                      }
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("labels.departmentPlaceholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departmentOptions.map((option) => (
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

            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Strategies & Segments</h3>
              {Array.from(
                { length: STRATEGY_SEGMENT_COUNT },
                (_, i) => i + 1
              ).map((num) => (
                <div className="grid grid-cols-2 gap-4" key={num}>
                  <FormField
                    control={form.control}
                    name={`strategy${num}` as keyof InviteFormValues}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t(`labels.strategy${num}`)}</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value as InvestorStrategy)
                          }
                          value={field.value as string}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  `labels.strategy${num}Placeholder`
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {investorStrategyOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`segment${num}` as keyof InviteFormValues}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t(`labels.segment${num}`)}</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value as InvestorSegment)
                          }
                          value={field.value as string}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  `labels.segment${num}Placeholder`
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {investorSegmentOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
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
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Locations</h3>
              {Array.from({ length: LOCATION_COUNT }, (_, i) => i + 1).map(
                (num) => (
                  <FormField
                    control={form.control}
                    key={num}
                    name={`location${num}` as keyof InviteFormValues}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t(`labels.location${num}`)}</FormLabel>
                        <FormControl>
                          <Input placeholder={`Location ${num}`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              )}
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
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Investment Details</h3>
              <FormField
                control={form.control}
                name="minTicketSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.minTicketSize")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0"
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? Number.parseFloat(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxTicketSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.maxTicketSize")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0"
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? Number.parseFloat(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetReturnIRR"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.targetReturnIRR")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0"
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? Number.parseFloat(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Lead Information</h3>
              <FormField
                control={form.control}
                name="leadResponsibleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.leadResponsible")}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("labels.leadResponsiblePlaceholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teamUsers?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="leadResponsibleTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.leadResponsibleTeam")}</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value as TeamMember)
                      }
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "labels.leadResponsibleTeamPlaceholder"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teamMemberOptions.map((option) => (
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
              <FormField
                control={form.control}
                name="leadMainContactId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.leadMainContact")}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("labels.leadMainContactPlaceholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teamUsers?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="leadMainContactTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.leadMainContactTeam")}</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value as TeamMember)
                      }
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "labels.leadMainContactTeamPlaceholder"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teamMemberOptions.map((option) => (
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

            <div className="space-y-4">
              <h3 className="font-semibold text-sm">
                Contact & Additional Information
              </h3>
              <FormField
                control={form.control}
                name="physicalAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.physicalAddress")}</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Physical Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.website")}</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastContactDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.lastContactDate")}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="acceptMarketingList"
                render={({ field }) => {
                  const handleValueChange = (value: string) => {
                    if (value === "yes") {
                      field.onChange(true);
                    } else if (value === "no") {
                      field.onChange(false);
                    } else {
                      field.onChange(undefined);
                    }
                  };

                  const getSelectValue = () => {
                    if (field.value === true) {
                      return "yes";
                    }
                    if (field.value === false) {
                      return "no";
                    }
                    return;
                  };

                  return (
                    <FormItem>
                      <FormLabel>{t("labels.acceptMarketingList")}</FormLabel>
                      <Select
                        onValueChange={handleValueChange}
                        value={getSelectValue()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "labels.acceptMarketingListPlaceholder"
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">{t("labels.yes")}</SelectItem>
                          <SelectItem value="no">{t("labels.no")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="otherFacts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.otherFacts")}</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Other facts..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.lastNotes")}</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Last notes..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
