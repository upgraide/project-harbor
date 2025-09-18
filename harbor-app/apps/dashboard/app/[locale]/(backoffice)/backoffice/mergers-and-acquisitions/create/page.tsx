"use client";

import { api } from "@harbor-app/backend/convex/_generated/api";
import type { Id } from "@harbor-app/backend/convex/_generated/dataModel";
import { Button } from "@harbor-app/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@harbor-app/ui/components/card";
import {
  Form,
  FormControl,
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

// Form configuration
const FORM_CONFIG = {
  sales: [
    { value: "0-5", label: "€0-5M" },
    { value: "5-10", label: "€5-10M" },
    { value: "10-15", label: "€10-15M" },
    { value: "20-30", label: "€20-30M" },
    { value: "30+", label: "€30M+" },
  ],
  ebitda: [
    { value: "1-2", label: "€1-2M" },
    { value: "2-3", label: "€2-3M" },
    { value: "3-5", label: "€3-5M" },
    { value: "5+", label: "€5M+" },
  ],
  industry: [
    "Services",
    "Transformation Industry", 
    "Trading",
    "Energy & Infrastructure",
    "Fitness",
    "Healthcare & Pharmaceuticals",
    "IT",
    "TMT (Technology, Media & Telecommunications)",
    "Transports",
  ],
  type: [
    { value: "Buy In", label: "Buy In" },
    { value: "Buy Out", label: "Buy Out" },
  ],
  typeDetails: [
    { value: "Majority", label: "Majority" },
    { value: "Minority", label: "Minority" },
    { value: "Full", label: "Full" },
  ],
  status: [
    { value: "no-interest", label: "No Interest" },
    { value: "interested", label: "Interested" },
    { value: "completed", label: "Completed" },
  ],
} as const;

const formSchema = z.object({
  // Basic Information
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
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

// Reusable form field components
interface FormFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "textarea";
  step?: string;
  required?: boolean;
}

const FormFieldWrapper = ({ control, name, label, placeholder, type = "text", step, required }: FormFieldProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>
          {label} {required && "*"}
        </FormLabel>
        <FormControl>
          {type === "textarea" ? (
            <Textarea
              className="min-h-20"
              placeholder={placeholder}
              {...field}
            />
          ) : (
            <Input
              placeholder={placeholder}
              type={type}
              step={step}
              {...field}
              onChange={(e) =>
                field.onChange(
                  type === "number" && e.target.value
                    ? parseFloat(e.target.value)
                    : e.target.value
                )
              }
            />
          )}
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

interface SelectFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  options: readonly { value: string; label: string }[] | readonly string[];
  required?: boolean;
}

const SelectField = ({ control, name, label, placeholder, options, required }: SelectFieldProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>
          {label} {required && "*"}
        </FormLabel>
        <Select defaultValue={field.value} onValueChange={field.onChange}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((option) => {
              const value = typeof option === "string" ? option : option.value;
              const label = typeof option === "string" ? option : option.label;
              return (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default function CreateMAOpportunity() {
  const router = useRouter();
  const createOpportunity = useMutation(api.private.mergersAndAcquisitionsOpportunities.create);
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
        const imageIds: Id<"_storage">[] = [];
        if (data.images && data.images.length > 0) {
          // TODO: Convert uploaded file URLs to storage IDs
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
    <div className="container mx-auto py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button asChild size="sm" variant="ghost">
          <Link href="/backoffice/mergers-and-acquisitions">
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create M&A Opportunity</h1>
          <p className="text-muted-foreground">Add a new opportunity to the system</p>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormFieldWrapper
                control={form.control}
                name="name"
                label="Opportunity Name"
                placeholder="Enter opportunity name"
                required
              />
              
              <FormFieldWrapper
                control={form.control}
                name="description"
                label="Description"
                placeholder="Enter opportunity description"
                type="textarea"
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
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  control={form.control}
                  name="sales"
                  label="Sales Range"
                  placeholder="Select sales range"
                  options={FORM_CONFIG.sales}
                  required
                />
                <SelectField
                  control={form.control}
                  name="ebitda"
                  label="EBITDA Range"
                  placeholder="Select EBITDA range"
                  options={FORM_CONFIG.ebitda}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormFieldWrapper
                  control={form.control}
                  name="ebitdaNormalized"
                  label="EBITDA Normalized (€M)"
                  placeholder="Enter normalized EBITDA"
                  type="number"
                  step="0.1"
                />
                <FormFieldWrapper
                  control={form.control}
                  name="netDebt"
                  label="Net Debt (€M)"
                  placeholder="Enter net debt"
                  type="number"
                  step="0.1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Industry & Transaction */}
          <Card>
            <CardHeader>
              <CardTitle>Industry & Transaction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  control={form.control}
                  name="industry"
                  label="Industry"
                  placeholder="Select industry"
                  options={FORM_CONFIG.industry}
                  required
                />
                <FormFieldWrapper
                  control={form.control}
                  name="subIndustry"
                  label="Sub-Industry"
                  placeholder="Enter sub-industry"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectField
                  control={form.control}
                  name="type"
                  label="Transaction Type"
                  placeholder="Select type"
                  options={FORM_CONFIG.type}
                  required
                />
                <SelectField
                  control={form.control}
                  name="typeDetails"
                  label="Ownership Level"
                  placeholder="Select ownership"
                  options={FORM_CONFIG.typeDetails}
                  required
                />
                <SelectField
                  control={form.control}
                  name="status"
                  label="Status"
                  placeholder="Select status"
                  options={FORM_CONFIG.status}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Asset Information */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-3">
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
                      <FormLabel>Asset Included</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormFieldWrapper
                  control={form.control}
                  name="assetValue"
                  label="Asset Value (€M)"
                  placeholder="Enter asset value"
                  type="number"
                  step="0.1"
                />
                <FormFieldWrapper
                  control={form.control}
                  name="salesCAGR"
                  label="Sales CAGR (%)"
                  placeholder="Enter sales CAGR"
                  type="number"
                  step="0.1"
                />
                <FormFieldWrapper
                  control={form.control}
                  name="ebitdaCAGR"
                  label="EBITDA CAGR (%)"
                  placeholder="Enter EBITDA CAGR"
                  type="number"
                  step="0.1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Post-NDA Information */}
          <Card>
            <CardHeader>
              <CardTitle>Post-NDA Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormFieldWrapper
                  control={form.control}
                  name="entrepriveValue"
                  label="Enterprise Value (€M)"
                  placeholder="Enter enterprise value"
                  type="number"
                  step="0.1"
                />
                <FormFieldWrapper
                  control={form.control}
                  name="equityValue"
                  label="Equity Value (€M)"
                  placeholder="Enter equity value"
                  type="number"
                  step="0.1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormFieldWrapper
                  control={form.control}
                  name="evDashEbitdaEntry"
                  label="EV/EBITDA Entry"
                  placeholder="Enter EV/EBITDA entry"
                  type="number"
                  step="0.1"
                />
                <FormFieldWrapper
                  control={form.control}
                  name="evDashEbitdaExit"
                  label="EV/EBITDA Exit"
                  placeholder="Enter EV/EBITDA exit"
                  type="number"
                  step="0.1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormFieldWrapper
                  control={form.control}
                  name="ebitdaMargin"
                  label="EBITDA Margin (%)"
                  placeholder="Enter EBITDA margin"
                  type="number"
                  step="0.1"
                />
                <FormFieldWrapper
                  control={form.control}
                  name="freeCashFlow"
                  label="Free Cash Flow (€M)"
                  placeholder="Enter free cash flow"
                  type="number"
                  step="0.1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormFieldWrapper
                  control={form.control}
                  name="netDebtDashEbitda"
                  label="Net Debt/EBITDA"
                  placeholder="Enter net debt/EBITDA"
                  type="number"
                  step="0.1"
                />
                <FormFieldWrapper
                  control={form.control}
                  name="capexIntensity"
                  label="Capex Intensity (%)"
                  placeholder="Enter capex intensity"
                  type="number"
                  step="0.1"
                />
                <FormFieldWrapper
                  control={form.control}
                  name="workingCapitalNeeds"
                  label="Working Capital Needs (€M)"
                  placeholder="Enter working capital needs"
                  type="number"
                  step="0.1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
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
              {isPending && <LoaderIcon className="h-4 w-4 animate-spin mr-2" />}
              Create Opportunity
            </SubmitButton>
          </div>
        </form>
      </Form>
    </div>
  );
}
