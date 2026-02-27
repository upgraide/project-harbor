"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
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
import { UserSelect } from "@/features/users/components/user-select";
import {
  Department,
  InvestorClientType,
  InvestorSegment,
  InvestorStrategy,
  LeadPriority,
  LeadSource,
  LeadStatus,
  TeamMember,
} from "@/generated/prisma";
import { useUpdateInvestor } from "../hooks/use-update-investor";
import {
  departmentOptions,
  investorClientTypeOptions,
  investorSegmentOptions,
  investorStrategyOptions,
  teamMemberOptions,
} from "../utils/enum-mappings";

const updateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  companyName: z.string().optional(),
  representativeName: z.string().optional(),
  phoneNumber: z.string().optional(),
  physicalAddress: z.string().optional(),
  website: z.string().optional(),
  type: z.nativeEnum(InvestorClientType).optional(),
  investorType: z.enum(["<€10M", "€10M-€100M", ">€100M"]).optional(),
  department: z.nativeEnum(Department).optional(),
  strategy1: z.nativeEnum(InvestorStrategy).optional(),
  segment1: z.nativeEnum(InvestorSegment).optional(),
  strategy2: z.nativeEnum(InvestorStrategy).optional(),
  segment2: z.nativeEnum(InvestorSegment).optional(),
  strategy3: z.nativeEnum(InvestorStrategy).optional(),
  segment3: z.nativeEnum(InvestorSegment).optional(),
  location1: z.string().optional(),
  location2: z.string().optional(),
  location3: z.string().optional(),
  preferredLocation: z.string().optional(),
  minTicketSize: z.number().optional(),
  maxTicketSize: z.number().optional(),
  targetReturnIRR: z.number().optional(),
  leadResponsibleId: z.string().nullable().optional(),
  leadMainContactId: z.string().nullable().optional(),
  leadResponsibleTeam: z.nativeEnum(TeamMember).optional(),
  leadMainContactTeam: z.nativeEnum(TeamMember).optional(),
  leadStatus: z.nativeEnum(LeadStatus).optional(),
  leadPriority: z.nativeEnum(LeadPriority).optional(),
  leadSource: z.nativeEnum(LeadSource).optional(),
  nextFollowUpDate: z.string().nullable().optional(),
  lastContactDate: z.string().nullable().optional(),
  acceptMarketingList: z.boolean().optional(),
  otherFacts: z.string().optional(),
  lastNotes: z.string().optional(),
});

type UpdateFormValues = z.infer<typeof updateFormSchema>;

type InvestorDetailEditFormProps = {
  investor: any;
};

export const InvestorDetailEditForm = ({
  investor,
}: InvestorDetailEditFormProps) => {
  const updateInvestor = useUpdateInvestor();
  const [isSaving, setIsSaving] = useState(false);

  const formatDate = (date: Date | null | undefined): string => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const formatInvestorType = (
    type: string | null | undefined
  ): "<€10M" | "€10M-€100M" | ">€100M" | undefined => {
    if (!type) return;
    if (type === "LESS_THAN_10M") return "<€10M";
    if (type === "BETWEEN_10M_100M") return "€10M-€100M";
    if (type === "GREATER_THAN_100M") return ">€100M";
    return;
  };

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      name: investor.name,
      email: investor.email,
      companyName: investor.companyName ?? "",
      representativeName: investor.representativeName ?? "",
      phoneNumber: investor.phoneNumber ?? "",
      physicalAddress: investor.physicalAddress ?? "",
      website: investor.website ?? "",
      type: investor.type ?? undefined,
      investorType: formatInvestorType(investor.investorType),
      department: investor.department ?? undefined,
      strategy1: investor.strategy1 ?? undefined,
      segment1: investor.segment1 ?? undefined,
      strategy2: investor.strategy2 ?? undefined,
      segment2: investor.segment2 ?? undefined,
      strategy3: investor.strategy3 ?? undefined,
      segment3: investor.segment3 ?? undefined,
      location1: investor.location1 ?? "",
      location2: investor.location2 ?? "",
      location3: investor.location3 ?? "",
      preferredLocation: investor.preferredLocation ?? "",
      minTicketSize: investor.minTicketSize ?? undefined,
      maxTicketSize: investor.maxTicketSize ?? undefined,
      targetReturnIRR: investor.targetReturnIRR ?? undefined,
      leadResponsibleId: investor.leadResponsibleId ?? null,
      leadMainContactId: investor.leadMainContactId ?? null,
      leadResponsibleTeam: investor.leadResponsibleTeam ?? undefined,
      leadMainContactTeam: investor.leadMainContactTeam ?? undefined,
      leadStatus: investor.leadStatus ?? undefined,
      leadPriority: investor.leadPriority ?? undefined,
      leadSource: investor.leadSource ?? undefined,
      nextFollowUpDate: formatDate(investor.nextFollowUpDate),
      lastContactDate: formatDate(investor.lastContactDate),
      acceptMarketingList: investor.acceptMarketingList ?? false,
      otherFacts: investor.otherFacts ?? "",
      lastNotes: investor.lastNotes ?? "",
    },
  });

  const onSubmit = async (data: UpdateFormValues) => {
    setIsSaving(true);
    try {
      await updateInvestor.mutateAsync({
        id: investor.id,
        ...data,
        minTicketSize: data.minTicketSize,
        maxTicketSize: data.maxTicketSize,
        targetReturnIRR: data.targetReturnIRR,
        nextFollowUpDate: data.nextFollowUpDate
          ? new Date(data.nextFollowUpDate)
          : null,
        lastContactDate: data.lastContactDate
          ? new Date(data.lastContactDate)
          : null,
      });
    } catch (error) {
      console.error("Failed to update investor:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex justify-end">
          <Button disabled={isSaving} type="submit">
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Primary contact details and identification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
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
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Representative Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="physicalAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Physical Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={2} />
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
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input type="url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Classification */}
          <Card>
            <CardHeader>
              <CardTitle>Classification</CardTitle>
              <CardDescription>
                Investor type and categorization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
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
                    <FormLabel>Investor Size</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="<€10M">&lt;€10M</SelectItem>
                        <SelectItem value="€10M-€100M">€10M-€100M</SelectItem>
                        <SelectItem value=">€100M">&gt;€100M</SelectItem>
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
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
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
            </CardContent>
          </Card>
        </div>

        {/* Investment Preferences - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Preferences</CardTitle>
            <CardDescription>
              Strategy, segments, and target locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Primary */}
              <div className="space-y-4">
                <h4 className="font-medium">Primary</h4>
                <FormField
                  control={form.control}
                  name="strategy1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strategy</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {investorStrategyOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
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
                  name="segment1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Segment</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {investorSegmentOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
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
                  name="location1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Secondary */}
              <div className="space-y-4">
                <h4 className="font-medium">Secondary</h4>
                <FormField
                  control={form.control}
                  name="strategy2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strategy</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {investorStrategyOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
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
                  name="segment2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Segment</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {investorSegmentOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
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
                  name="location2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Tertiary */}
              <div className="space-y-4">
                <h4 className="font-medium">Tertiary</h4>
                <FormField
                  control={form.control}
                  name="strategy3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strategy</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {investorStrategyOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
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
                  name="segment3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Segment</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {investorSegmentOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
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
                  name="location3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <FormField
                control={form.control}
                name="preferredLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minTicketSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Ticket (k€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
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
                    <FormLabel>Max Ticket (k€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
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
                    <FormLabel>Target IRR (%)</FormLabel>
                    <FormControl>
                      <Input
                        step="0.1"
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Lead Management - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Management</CardTitle>
            <CardDescription>
              CRM tracking and follow-up information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="leadStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(LeadStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.replace(/_/g, " ")}
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
                name="leadPriority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(LeadPriority).map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
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
                name="leadSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(LeadSource).map((source) => (
                          <SelectItem key={source} value={source}>
                            {source.replace(/_/g, " ")}
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
                name="leadResponsibleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead Responsible</FormLabel>
                    <UserSelect
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="leadMainContactId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Contact</FormLabel>
                    <UserSelect
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="leadResponsibleTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsible Team</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teamMemberOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
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
                name="nextFollowUpDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next Follow-up</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
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
                    <FormLabel>Last Contact</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="acceptMarketingList"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Accept Marketing List</FormLabel>
                    <FormDescription>
                      Investor has consented to receive marketing communications
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="otherFacts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Facts</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
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
                  <FormLabel>Last Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button disabled={isSaving} type="submit">
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
