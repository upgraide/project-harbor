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
import { backofficeRealEstatePath } from "@/lib/paths";
import {
  type CreateRealEstateFormSchemaType,
  realEstateCreateFormSchema,
} from "../schema/real-estate-create-form-schema";

const RealEstateCreateForm = () => {
  const router = useRouter();

  const createRealEstate = useMutation(api.realEstates.create);

  const form = useForm<CreateRealEstateFormSchemaType>({
    resolver: zodResolver(realEstateCreateFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: CreateRealEstateFormSchemaType) => {
    toast.promise(
      createRealEstate({
        ...values,
      }),
      {
        loading: "Creating Real Estate Opportunity",
        success: "Real Estate Opportunity created successfully",
        error: "Failed to create Real Estate Opportunity",
      }
    );

    form.reset();
    router.push(backofficeRealEstatePath());
  };

  return (
    <div className="mx-auto w-full max-w-md md:max-w-3xl">
      <Card className="mx-6 my-12">
        <CardHeader>
          <CardTitle>Create Real Estate Opportunity</CardTitle>
          <CardDescription>
            Create a new Real Estate opportunity. Insert the following
            information:
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
                name="asset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset</FormLabel>
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
                            "Agnostic",
                            "Mixed",
                            "Hospitality",
                            "Logistics & Industrial",
                            "Office",
                            "Residential",
                            "Senior Living",
                            "Shopping Center",
                            "Street Retail",
                            "Student Housing",
                          ].map((asset) => (
                            <SelectItem key={asset} value={asset}>
                              {asset}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("asset") === "Hospitality" && (
                <>
                  <FormField
                    control={form.control}
                    name="nRoomsLastYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Rooms Last Year</FormLabel>
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
                    name="noi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NOI (Stabilized)</FormLabel>
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
                    name="occupancyLastYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occupancy Last Year</FormLabel>
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

              {form.watch("asset") === "Logistics & Industrial" && (
                <FormField
                  control={form.control}
                  name="walt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WALT</FormLabel>
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
              )}

              {form.watch("asset") === "Office" && (
                <FormField
                  control={form.control}
                  name="walt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WALT</FormLabel>
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
              )}

              {form.watch("asset") === "Senior Living" && (
                <FormField
                  control={form.control}
                  name="nBeds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Beds</FormLabel>
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
              )}

              {form.watch("asset") === "Student Housing" && (
                <FormField
                  control={form.control}
                  name="nBeds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Beds</FormLabel>
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
              )}

              <FormField
                control={form.control}
                name="investment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investment</FormLabel>
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
                            "Lease and Operation",
                            "S&L",
                            "Core",
                            "Fix&Flip",
                            "Refurbishment",
                            "Value-add",
                            "Opportunistic",
                            "Development",
                          ].map((investment) => (
                            <SelectItem key={investment} value={investment}>
                              {investment}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("investment") === "Lease and Operation" && (
                <FormField
                  control={form.control}
                  name="subRent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub Rent</FormLabel>
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
              )}

              {(form.watch("investment") === "S&L" ||
                form.watch("investment") === "Core") && (
                <>
                  <FormField
                    control={form.control}
                    name="subRent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sub Rent</FormLabel>
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
                    name="rentPerSqm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rent per Square Meter</FormLabel>
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
                    name="subYield"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sub Yield</FormLabel>
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

              {(form.watch("investment") === "Fix&Flip" ||
                form.watch("investment") === "Refurbishment" ||
                form.watch("investment") === "Value-add" ||
                form.watch("investment") === "Opportunistic" ||
                form.watch("investment") === "Development") && (
                <>
                  <FormField
                    control={form.control}
                    name="capex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capex</FormLabel>
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
                    name="capexPerSqm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capex per Square Meter</FormLabel>
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
                    name="sale"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sale</FormLabel>
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
                    name="salePerSqm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sale per Square Meter</FormLabel>
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

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
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
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area</FormLabel>
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
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
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
                name="yield"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yield</FormLabel>
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
                name="rent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rent</FormLabel>
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
                name="gcaAboveGround"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GCA Above Ground</FormLabel>
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
                name="gcaBelowGround"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GCA Below Ground</FormLabel>
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
                name="license"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License</FormLabel>
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
                name="irr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IRR</FormLabel>
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
                name="coc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>COC</FormLabel>
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
                name="licenseStage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Stage</FormLabel>
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
                name="holdingPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Holding Period</FormLabel>
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
                name="breakEvenOccupancy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Break Even Occupancy</FormLabel>
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
                name="vacancyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vacancy Rate</FormLabel>
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
                name="estimatedRentValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Rent Value</FormLabel>
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
                name="occupancyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupancy Rate</FormLabel>
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
                    <FormLabel>MOIC</FormLabel>
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
                name="totalInvestment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Investment</FormLabel>
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
                name="profitOnCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profit On Cost</FormLabel>
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
                name="profit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profit</FormLabel>
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
                name="sofCosts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SOF Costs</FormLabel>
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
                name="sellPerSqm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sell Per Square Meter</FormLabel>
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
                name="gdv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GDV</FormLabel>
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
                name="wault"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WALT</FormLabel>
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
                name="debtServiceCoverageRatio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Debt Service Coverage Ratio</FormLabel>
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
                name="expectedExitYield"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Exit Yield</FormLabel>
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
                name="ltv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LTV</FormLabel>
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
                name="ltc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LTC</FormLabel>
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
                name="yieldOnCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yield On Cost</FormLabel>
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
                    name="gpEquityValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GP Equity Value</FormLabel>
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
                    name="gpEquencyPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GP Equity Percentage</FormLabel>
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
                    name="totalEquityRequired"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Equity Required</FormLabel>
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
                    name="sponsorPresentation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sponsor Presentation</FormLabel>
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
                    name="promoteStructure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Promote Structure</FormLabel>
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
                    name="projectIRR"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project IRR</FormLabel>
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
                    name="investorIRR"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Investor IRR</FormLabel>
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
                    name="coInvestmentHoldPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Co-Investment Hold Period</FormLabel>
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
                    name="coInvestmentBreakEvenOccupancy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Co-Investment Break Even Occupancy
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
                </>
              )}

              <SubmitButton
                className="w-full"
                isSubmitting={form.formState.isSubmitting}
                size="lg"
                type="submit"
              >
                Create Real Estate Opportunity
              </SubmitButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealEstateCreateForm;
