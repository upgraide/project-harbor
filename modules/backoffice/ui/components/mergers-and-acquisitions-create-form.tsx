"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  createMergersAndAcquisitionsFormSchema,
  CreateMergersAndAcquisitionsFormSchemaType,
} from "../schema/create-form-schema";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { backofficeMergersAndAcquisitionsPath } from "@/lib/paths";
import { useRouter } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";

const MergersAndAcquisitionsCreateForm = () => {
  const router = useRouter();

  const createMergersAndAcquisitions = useMutation(
    api.mergersAndAcquisitions.create,
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
        images: undefined,
        shareholderStructure: undefined,
      }),
      {
        loading: "Creating M&A Opportunity",
        success: "M&A Opportunity created successfully",
        error: "Failed to create M&A Opportunity",
      },
    );

    form.reset();
    router.push(backofficeMergersAndAcquisitionsPath());
  };

  return (
    <div className="mx-auto w-full max-w-md md:max-w-3xl">
      <Card className="my-12 mx-6">
        <CardHeader>
          <CardTitle>Create M&A Opportunity</CardTitle>
          <CardDescription>
            Create a new M&A opportunity. Insert the following information:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              {/* TODO: Add the Photos field */}

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
                            ),
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
                              ),
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
                              ),
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
                              ),
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
                            ),
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
                name="netDebt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Net Debt</FormLabel>
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
                name="salesCAGR"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sales CAGR</FormLabel>
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
                name="ebitdaCAGR"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EBITDA CAGR</FormLabel>
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

              {/* TODO: Add the Shareholder Structure field */}

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
                name="equityValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equity Value</FormLabel>
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
                name="evDashEbitdaEntry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EV/EBITDA (Entry)</FormLabel>
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
                name="evDashEbitdaExit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EV/EBITDA (Exit/Comps)</FormLabel>
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
                name="ebitdaMargin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EBITDA Margin</FormLabel>
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
                name="fcf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Free Cash Flow</FormLabel>
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
                name="netDebtDashEbitda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Net Debt/EBITDA</FormLabel>

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
                name="capexItensity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capex Intensity (Capex/EBITDA)</FormLabel>
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
                name="workingCapitalNeeds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Working Capital Needs</FormLabel>
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
                    name="grossIRR"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gross IRR</FormLabel>
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
                    name="netIRR"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Net IRR</FormLabel>
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
                    name="cashOnCashReturn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cash-On-Cash Return</FormLabel>
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
                    name="cashConvertion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cash Convertion (FCF/EBITDA)</FormLabel>
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
                    name="entryMultiple"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entry Multiple</FormLabel>
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
                    name="exitExpectedMultiple"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exit Expected Multiple</FormLabel>
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
                    name="holdPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hold Period (years)</FormLabel>
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
                </>
              )}

              <SubmitButton
                isSubmitting={form.formState.isSubmitting}
                size="lg"
                type="submit"
                className="w-full"
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
