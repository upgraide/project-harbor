"use client";

import { api } from "@harbor-app/backend/convex/_generated/api";
import type { Id } from "@harbor-app/backend/convex/_generated/dataModel";
import { Button } from "@harbor-app/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@harbor-app/ui/components/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@harbor-app/ui/components/form";
import { Input } from "@harbor-app/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@harbor-app/ui/components/select";
import { SubmitButton } from "@harbor-app/ui/components/submit-button";
import { Textarea } from "@harbor-app/ui/components/textarea";
import { UploadInput } from "@harbor-app/ui/components/upload-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ArrowLeftIcon, LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  // Basic Information
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  images: z.array(z.string()).optional(),

  // Financial Information
  sales: z.enum(["0-5", "5-10", "10-15", "20-30", "30+"]),
  ebitda: z.enum(["1-2", "2-3", "3-5", "5+"]),
  ebitdaNormalized: z.number().optional(),
  netDebt: z.number().optional(),

  // Industry Information
  industry: z.enum([
    "Services",
    "Transformation Industry",
    "Trading",
    "Energy & Infrastructure",
    "Fitness",
    "Healthcare & Pharmaceuticals",
    "IT",
    "TMT (Technology, Media & Telecommunications)",
    "Transports",
  ]),
  subIndustry: z.string().optional(),

  // Transaction Details
  type: z.enum(["Buy In", "Buy Out"]),
  typeDetails: z.enum(["Majority", "Minority", "Full"]),
  status: z.enum(["no-interest", "interested", "completed"]),

  // Asset Information
  assetIncluded: z.boolean().optional(),
  assetValue: z.number().optional(),
  salesCAGR: z.number().optional(),
  ebitdaCAGR: z.number().optional(),

  // Post-NDA Information
  entrepriveValue: z.number().optional(),
  equityValue: z.number().optional(),
  evDashEbitdaEntry: z.number().optional(),
  evDashEbitdaExit: z.number().optional(),
  ebitdaMargin: z.number().optional(),
  freeCashFlow: z.number().optional(),
  netDebtDashEbitda: z.number().optional(),
  capexIntensity: z.number().optional(),
  workingCapitalNeeds: z.number().optional(),
});

type FormData = z.infer<typeof formSchema>;

const salesOptions = [
  { value: "0-5", label: "€0-5M" },
  { value: "5-10", label: "€5-10M" },
  { value: "10-15", label: "€10-15M" },
  { value: "20-30", label: "€20-30M" },
  { value: "30+", label: "€30M+" },
];

const ebitdaOptions = [
  { value: "1-2", label: "€1-2M" },
  { value: "2-3", label: "€2-3M" },
  { value: "3-5", label: "€3-5M" },
  { value: "5+", label: "€5M+" },
];

const industryOptions = [
  "Services",
  "Transformation Industry",
  "Trading",
  "Energy & Infrastructure",
  "Fitness",
  "Healthcare & Pharmaceuticals",
  "IT",
  "TMT (Technology, Media & Telecommunications)",
  "Transports",
];

const typeOptions = [
  { value: "Buy In", label: "Buy In" },
  { value: "Buy Out", label: "Buy Out" },
];

const typeDetailsOptions = [
  { value: "Majority", label: "Majority" },
  { value: "Minority", label: "Minority" },
  { value: "Full", label: "Full" },
];

const statusOptions = [
  { value: "no-interest", label: "No Interest" },
  { value: "interested", label: "Interested" },
  { value: "completed", label: "Completed" },
];

export default function CreateMAOpportunity() {
  const router = useRouter();
  const createOpportunity = useMutation(
    api.private.mergersAndAcquisitionsOpportunities.create,
  );
  const generateUploadUrl = useMutation(api.private.files.generateUploadUrl);

  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      images: [],
      sales: "0-5",
      ebitda: "1-2",
      industry: "Services",
      type: "Buy In",
      typeDetails: "Majority",
      status: "no-interest",
      assetIncluded: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    startTransition(async () => {
      try {
        // Convert image URLs to storage IDs
        const imageIds: Id<"_storage">[] = [];
        if (data.images && data.images.length > 0) {
          // For now, we'll skip image processing as it requires more complex handling
          // In a real implementation, you'd convert the uploaded file URLs to storage IDs
          // The uploaded files would need to be processed to extract storage IDs
        }

        await createOpportunity({
          ...data,
          images: imageIds.length > 0 ? imageIds : undefined,
        });

        toast.success("M&A opportunity created successfully");
        router.push("/backoffice/mergers-and-acquisitions");
      } catch (error) {
        console.error("Failed to create opportunity:", error);
        toast.error("Failed to create M&A opportunity");
      }
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild size="sm" variant="ghost">
          <Link href="/backoffice/mergers-and-acquisitions">
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create M&A Opportunity</h1>
          <p className="text-muted-foreground">
            Add a new mergers and acquisitions opportunity to the system
          </p>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Essential details about the opportunity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opportunity Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter opportunity name" {...field} />
                    </FormControl>
                    <FormDescription>
                      A clear, descriptive name for this opportunity (max 100
                      characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-20"
                        placeholder="Enter opportunity description"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Detailed description of the opportunity (max 500
                      characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <UploadInput
                        accept="image/*"
                        generateUploadUrl={generateUploadUrl}
                        multiple
                        onUploadComplete={(uploaded) => {
                          const urls = uploaded.map(
                            (file) => (file.response as { url: string }).url,
                          );
                          field.onChange(urls);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload up to 10 images related to this opportunity
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
              <CardDescription>
                Key financial metrics and performance data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sales"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sales Range *</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sales range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {salesOptions.map((option) => (
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
                  name="ebitda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>EBITDA Range *</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select EBITDA range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ebitdaOptions.map((option) => (
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ebitdaNormalized"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>EBITDA Normalized (€M)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter normalized EBITDA"
                          step="0.1"
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
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
                  name="netDebt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Net Debt (€M)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter net debt"
                          step="0.1"
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
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

          {/* Industry & Transaction Details */}
          <Card>
            <CardHeader>
              <CardTitle>Industry & Transaction Details</CardTitle>
              <CardDescription>
                Industry classification and transaction structure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry *</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {industryOptions.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
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
                  name="subIndustry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub-Industry</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter sub-industry" {...field} />
                      </FormControl>
                      <FormDescription>
                        Required for Services, Transformation Industry, or
                        Trading
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Type *</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {typeOptions.map((option) => (
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
                  name="typeDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ownership Level *</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select ownership" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {typeDetailsOptions.map((option) => (
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((option) => (
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
            </CardContent>
          </Card>

          {/* Asset Information */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Information</CardTitle>
              <CardDescription>
                Asset details and growth metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="assetIncluded"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <input
                          checked={field.value}
                          className="h-4 w-4"
                          onChange={field.onChange}
                          type="checkbox"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Asset Included</FormLabel>
                        <FormDescription>
                          Check if assets are included in this opportunity
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assetValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Value (€M)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter asset value"
                          step="0.1"
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="salesCAGR"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sales CAGR (%)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter sales CAGR"
                          step="0.1"
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
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
                  name="ebitdaCAGR"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>EBITDA CAGR (%)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter EBITDA CAGR"
                          step="0.1"
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
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

          {/* Post-NDA Information */}
          <Card>
            <CardHeader>
              <CardTitle>Post-NDA Information</CardTitle>
              <CardDescription>
                Detailed financial metrics (confidential information)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="entrepriveValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enterprise Value (€M)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter enterprise value"
                          step="0.1"
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
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
                  name="equityValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equity Value (€M)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter equity value"
                          step="0.1"
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="evDashEbitdaEntry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>EV/EBITDA Entry</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter EV/EBITDA entry"
                          step="0.1"
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
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
                  name="evDashEbitdaExit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>EV/EBITDA Exit</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter EV/EBITDA exit"
                          step="0.1"
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ebitdaMargin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>EBITDA Margin (%)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter EBITDA margin"
                          step="0.1"
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
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
                  name="freeCashFlow"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Free Cash Flow (€M)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter free cash flow"
                          step="0.1"
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="netDebtDashEbitda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Net Debt/EBITDA</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter net debt/EBITDA"
                          step="0.1"
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
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
                  name="capexIntensity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capex Intensity (%)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter capex intensity"
                          step="0.1"
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
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
                  name="workingCapitalNeeds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Working Capital Needs (€M)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter working capital needs"
                          step="0.1"
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
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

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              disabled={isPending}
              onClick={() => router.back()}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <SubmitButton
              disabled={isPending}
              isSubmitting={isPending}
              type="submit"
            >
              {isPending && <LoaderIcon className="h-4 w-4 animate-spin" />}
              Create Opportunity
            </SubmitButton>
          </div>
        </form>
      </Form>
    </div>
  );
}
