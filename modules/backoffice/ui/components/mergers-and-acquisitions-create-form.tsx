"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Uploader } from "@/components/file-uploader/uploader";
import { SubmitButton } from "@/components/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { api } from "@/convex/_generated/api";
import { backofficeMergersAndAcquisitionsPath } from "@/lib/paths";
import {
  type CreateMergersAndAcquisitionsFormSchemaType,
  createMergersAndAcquisitionsFormSchema,
} from "../schema/mergers-and-acquisitions-create-form-schema";

const MergersAndAcquisitionsCreateForm = () => {
  const router = useRouter();

  const createMergersAndAcquisitions = useMutation(
    api.mergersAndAcquisitions.create
  );

  const form = useForm<CreateMergersAndAcquisitionsFormSchemaType>({
    resolver: zodResolver(createMergersAndAcquisitionsFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: CreateMergersAndAcquisitionsFormSchemaType) => {
    toast.promise(
      createMergersAndAcquisitions({
        ...values,
      }),
      {
        loading: "Creating M&A Opportunity",
        success: "M&A Opportunity created successfully",
        error: "Failed to create M&A Opportunity",
      }
    );

    form.reset();
    router.push(backofficeMergersAndAcquisitionsPath());
  };

  return (
    <div className="mx-auto w-full max-w-md md:max-w-3xl">
      <Card className="mx-6 my-12">
        <CardHeader>
          <CardTitle>Create M&A Opportunity</CardTitle>
          <CardDescription>
            Create a new M&A opportunity. Insert the following information:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
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
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <Uploader onChange={field.onChange} value={field.value} />
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
                    <FormLabel>Type (Buy In/Buy Out)</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Buy In", "Buy Out", "Buy In/Buy Out"].map(
                            (type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("type") === "Buy In" && (
                <FormField
                  control={form.control}
                  name="typeDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Type Details (Maioritário/Minoritário)
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {["Maioritário", "Minoritário"].map(
                              (typeDetails) => (
                                <SelectItem
                                  key={typeDetails}
                                  value={typeDetails}
                                >
                                  {typeDetails}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch("type") === "Buy Out" && (
                <FormField
                  control={form.control}
                  name="typeDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Type Details (Maioritário/Minoritário/100%)
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {["Maioritário", "Minoritário", "100%"].map(
                              (typeDetails) => (
                                <SelectItem
                                  key={typeDetails}
                                  value={typeDetails}
                                >
                                  {typeDetails}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "Services",
                            "Transformation Industry",
                            "Trading",
                            "Energy & Infrastructure",
                            "Fitness",
                            "Healthcare & Pharmaceuticals",
                            "IT",
                            "TMT (Technology, Media & Telecom)",
                            "Transports",
                          ].map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("industry") === "Services" && (
                <FormField
                  control={form.control}
                  name="industrySubsector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry Subsector</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {["Business Services", "Financial Services"].map(
                              (industrySubsector) => (
                                <SelectItem
                                  key={industrySubsector}
                                  value={industrySubsector}
                                >
                                  {industrySubsector}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {(form.watch("industry") === "Transformation Industry" ||
                form.watch("industry") === "Trading") && (
                <FormField
                  control={form.control}
                  name="industrySubsector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry Subsector</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "Construction & Materials",
                              "Food & Beverages",
                              "Others",
                            ].map((industrySubsector) => (
                              <SelectItem
                                key={industrySubsector}
                                value={industrySubsector}
                              >
                                {industrySubsector}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="sales"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sales (in Millions)</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {["0-5", "5-10", "10-15", "20-30", "30+"].map(
                            (sales) => (
                              <SelectItem key={sales} value={sales}>
                                {sales}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
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
                    <FormLabel>EBITDA (in Millions)</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {["1-2", "2-3", "3-5", "5+"].map((ebitda) => (
                            <SelectItem key={ebitda} value={ebitda}>
                              {ebitda}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ebitdaNormalized"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EBITDA Normalized</FormLabel>
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
                name="netDebt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Net Debt</FormLabel>
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

              <FormField
                control={form.control}
                name="preNDANotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pre NDA Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        maxLength={1000}
                        placeholder="Insert pre-NDA notes"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postNDANotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post NDA Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        maxLength={1000}
                        placeholder="Insert post-NDA notes"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salesCAGR"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sales CAGR</FormLabel>
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
                name="ebitdaCAGR"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EBITDA CAGR</FormLabel>
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
                name="assetIncluded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Included</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                        value={field.value?.toString()}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedAssetValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Asset Value</FormLabel>
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
                name="shareholderStructure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shareholder Structure</FormLabel>
                    <FormControl>
                      <Uploader onChange={field.onChange} value={field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="im"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IM</FormLabel>
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
                name="entrepriseValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entreprise Value</FormLabel>
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
                name="equityValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equity Value</FormLabel>
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
                name="evDashEbitdaEntry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EV/EBITDA (Entry)</FormLabel>
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
                name="evDashEbitdaExit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EV/EBITDA (Exit/Comps)</FormLabel>
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

              <FormField
                control={form.control}
                name="fcf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Free Cash Flow</FormLabel>
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
                name="netDebtDashEbitda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Net Debt/EBITDA</FormLabel>

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
                name="capexItensity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capex Intensity (Capex/EBITDA)</FormLabel>
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
                name="workingCapitalNeeds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Working Capital Needs</FormLabel>
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
                name="coInvestment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Add Co-Investment Button?</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                        value={field.value?.toString()}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("coInvestment") === true && (
                <>
                  <FormField
                    control={form.control}
                    name="equityContribution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equity Contribution (%)</FormLabel>
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
                    name="grossIRR"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gross IRR</FormLabel>
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
                    name="netIRR"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Net IRR</FormLabel>
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
                    name="moic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          MOIC (Multiple on Investment Capital)
                        </FormLabel>
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
                    name="cashOnCashReturn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cash-On-Cash Return</FormLabel>
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
                    name="cashConvertion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cash Convertion (FCF/EBITDA)</FormLabel>
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
                    name="entryMultiple"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entry Multiple</FormLabel>
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
                    name="exitExpectedMultiple"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exit Expected Multiple</FormLabel>
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
                    name="holdPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hold Period (years)</FormLabel>
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
                </>
              )}

              <SubmitButton
                className="w-full"
                isSubmitting={form.formState.isSubmitting}
                size="lg"
                type="submit"
              >
                Create M&A Opportunity
              </SubmitButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MergersAndAcquisitionsCreateForm;
