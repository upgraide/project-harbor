"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Role } from "@/generated/prisma";
import { useScopedI18n } from "@/locales/client";
import { backofficeUsersPath } from "@/paths";
import { useCurrentUserRole } from "../hooks/use-current-user-role";
import { useUpdateUser } from "../hooks/use-update-user";
import { useSuspenseUser } from "../hooks/use-user";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.nativeEnum(Role),
});

type FormValues = z.infer<typeof formSchema>;

type UserEditContentProps = {
  userId: string;
};

export const UserEditContent = ({ userId }: UserEditContentProps) => {
  const t = useScopedI18n("backoffice.users.userEdit");
  const router = useRouter();
  const { data: user } = useSuspenseUser(userId);
  const updateUser = useUpdateUser();
  const { data: currentUserRole } = useCurrentUserRole();
  const isAdmin = currentUserRole === Role.ADMIN;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    await updateUser.mutateAsync({
      id: userId,
      ...values,
    });
    router.push(backofficeUsersPath());
  };

  const handleCancel = () => {
    router.push(backofficeUsersPath());
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <Card className="border-none bg-transparent shadow-none">
          <CardHeader>
            <CardTitle className="font-bold text-lg">
              {t("form.basicInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.name")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("form.namePlaceholder")}
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
                  <FormLabel>{t("form.email")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("form.emailPlaceholder")}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.role")}</FormLabel>
                  <Select
                    disabled={!isAdmin}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("form.rolePlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Role.USER}>
                        {t("form.roleUser")}
                      </SelectItem>
                      <SelectItem value={Role.TEAM}>
                        {t("form.roleTeam")}
                      </SelectItem>
                      <SelectItem value={Role.ADMIN}>
                        {t("form.roleAdmin")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {isAdmin 
                      ? t("form.roleDescription") 
                      : t("form.roleDescriptionRestricted")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button disabled={updateUser.isPending} type="submit">
            {updateUser.isPending ? t("form.saving") : t("form.save")}
          </Button>
          <Button
            onClick={handleCancel}
            type="button"
            variant="outline"
          >
            {t("form.cancel")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
