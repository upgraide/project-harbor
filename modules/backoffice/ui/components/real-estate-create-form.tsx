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
import {
  realEstateCreateFormSchema,
  CreateRealEstateFormSchemaType,
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
      },
    );

    form.reset();
    router.push(backofficeMergersAndAcquisitionsPath());
  };

  return (
    <div className="mx-auto w-full max-w-md md:max-w-3xl">
      <Card className="my-12 mx-6">
        <CardHeader>
          <CardTitle>Create Real Estate Opportunity</CardTitle>
          <CardDescription>
            Create a new Real Estate opportunity. Insert the following
            information:
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
                    name="noi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NOI (Stabilized)</FormLabel>
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
                    name="occupancyLastYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occupancy Last Year</FormLabel>
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
                    name="rentPerSqm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rent per Square Meter</FormLabel>
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
                    name="subYield"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sub Yield</FormLabel>
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
                    name="capexPerSqm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capex per Square Meter</FormLabel>
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
                    name="sale"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sale</FormLabel>
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
                    name="salePerSqm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sale per Square Meter</FormLabel>
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
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
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
                name="yield"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yield</FormLabel>
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
                name="rent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rent</FormLabel>
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
                name="gcaAboveGround"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GCA Above Ground</FormLabel>
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
                name="gcaBelowGround"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GCA Below Ground</FormLabel>
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

export default RealEstateCreateForm;
