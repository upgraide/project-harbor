"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useScopedI18n } from "@/locales/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";

const createRequestAccessSchema = (t: ReturnType<typeof useScopedI18n>) =>
  z.object({
    name: z.string().min(1, { message: t("schemaMessages.name.required") }),
    email: z.email({ message: t("schemaMessages.email.invalid") }),
    company: z
      .string()
      .min(1, { message: t("schemaMessages.company.required") }),
    phone: z.e164({ message: t("schemaMessages.phone.invalid") }),
    position: z
      .string()
      .min(1, { message: t("schemaMessages.position.required") }),
    message: z
      .string()
      .min(3, { message: t("schemaMessages.message.min") })
      .max(1000, { message: t("schemaMessages.message.max") }),
  });

export const RequestAccessView = () => {
  const t = useScopedI18n("requestAccessPage");

  const requestAccessSchema = createRequestAccessSchema(t);

  const form = useForm<z.infer<typeof requestAccessSchema>>({
    resolver: zodResolver(requestAccessSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      position: "",
      message: "",
    },
  });

  const onSubmit = (data: z.infer<typeof requestAccessSchema>) => {
    console.log(data);
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">{t("title")}</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("name.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("name.placeholder")}
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("email.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("email.placeholder")}
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("company.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("company.placeholder")}
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("position.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("position.placeholder")}
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("phone.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("phone.placeholder")}
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("message.label")}</FormLabel>
                    <FormControl>
                      <Textarea
                        maxLength={1000}
                        placeholder={t("message.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <SubmitButton
              isSubmitting={form.formState.isSubmitting}
              size="lg"
              type="submit"
              className="w-full"
            >
              {t("buttons.submit")}
            </SubmitButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
