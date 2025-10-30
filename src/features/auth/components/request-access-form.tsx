"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useScopedI18n } from "@/locales/client";
import { loginPath } from "@/paths";

const MIN_LENGTH = 1;
const MIN_MESSAGE_LENGTH = 10;
const MAX_LENGTH = 100;
const MESSAGE_MAX_LENGTH = 1000;

const createRequestAccessSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(MIN_LENGTH, { message: t("schemaMessages.name.required") })
      .max(MAX_LENGTH, { message: t("schemaMessages.name.max") }),
    email: z.email({ message: t("schemaMessages.email") }),
    company: z
      .string()
      .min(MIN_LENGTH, { message: t("schemaMessages.company.required") })
      .max(MAX_LENGTH, { message: t("schemaMessages.company.max") }),
    phone: z.e164({ message: t("schemaMessages.phone") }),
    position: z
      .string()
      .min(MIN_LENGTH, { message: t("schemaMessages.position.required") })
      .max(MAX_LENGTH, { message: t("schemaMessages.position.max") }),
    message: z
      .string()
      .min(MIN_MESSAGE_LENGTH, {
        message: t("schemaMessages.message.required"),
      })
      .max(MESSAGE_MAX_LENGTH, { message: t("schemaMessages.message.max") }),
  });

type RequestAccessFormValues = z.infer<
  ReturnType<typeof createRequestAccessSchema>
>;

export function RequestAccessForm() {
  const t = useScopedI18n("auth.requestAccessForm");

  const requestAccessSchema = createRequestAccessSchema(t);

  const form = useForm<RequestAccessFormValues>({
    resolver: zodResolver(requestAccessSchema),
    defaultValues: {
      email: "",
      name: "",
      company: "",
      phone: "",
      position: "",
      message: "",
    },
  });

  const onSubmit = async (values: RequestAccessFormValues) => {
    // biome-ignore lint/suspicious/noConsole: Temporary
    await console.log(values);
  };

  const isPending = form.formState.isSubmitting;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("labels.name")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("placeholders.name")}
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("emailPlaceholder")}
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
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("labels.company")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("placeholders.company")}
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("labels.phone")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("placeholders.phone")}
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
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("labels.position")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("placeholders.position")}
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
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("labels.message")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("placeholders.message")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="w-full" disabled={isPending} type="submit">
                    {t("submit")}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  {t("haveAccount")}{" "}
                  <Link
                    className="underline underline-offset-4"
                    href={loginPath()}
                  >
                    {t("login")}
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
