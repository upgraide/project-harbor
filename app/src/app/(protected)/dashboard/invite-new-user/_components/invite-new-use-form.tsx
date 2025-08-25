"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { tryCatch } from "@/hooks/try-catch";
import {
  type InviteNewUserSchemaType,
  inviteNewUserSchema,
} from "@/lib/zod/invite-new-user-schema";
import { dashboardPath } from "@/paths";
import { inviteNewUser } from "../actions";

const InviteNewUserForm = () => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<InviteNewUserSchemaType>({
    resolver: zodResolver(inviteNewUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      image: "",
      callbackURL: "",
    },
  });

  function onSubmit(values: InviteNewUserSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(inviteNewUser(values));

      if (error) {
        console.error("Error:", error);
        toast.error("Ocorreu um erro inesperado ao convidar o novo utilizador");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        router.push(dashboardPath());
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input placeholder="Nome do Utilizador" {...field} />
              </FormControl>
              <FormDescription>O nome do utilizador.</FormDescription>
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
                <Input placeholder="Email do Utilizador" {...field} />
              </FormControl>
              <FormDescription>O email do utilizador.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              A atualizar...
              <Loader2 className="ml-1 animate-spin" />
            </>
          ) : (
            <>
              Atualizar Estado
              <PlusIcon className="ml-1" size={16} />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default InviteNewUserForm;
