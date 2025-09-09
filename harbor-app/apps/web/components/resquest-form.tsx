"use client";

import { Button } from "@harbor-app/ui/components/button";
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
import { Textarea } from "@harbor-app/ui/components/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type SendRequestSchemaType,
  sendRequestSchema,
} from "@/actions/schema";
import { sendRequestAction } from "@/actions/send-request-actions";

export function ResquestForm() {
  const form = useForm<SendRequestSchemaType>({
    resolver: zodResolver(sendRequestSchema),
    defaultValues: {
      email: "",
      fullName: "",
      subject: "",
      type: "",
      priority: "",
      message: "",
    },
  });

  const sendSupport = useAction(sendRequestAction, {
    onSuccess: () => {
      toast.success("Support ticket sent.", {
        duration: 2500,
      });

      form.reset();
    },
    onError: () => {
      toast.error("Something went wrong pleaase try again.", {
        duration: 3500,
      });
    },
  });

  return (
    <Form {...form}>
      <form
        className="space-y-8"
        onSubmit={form.handleSubmit(sendSupport.execute)}
      >
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input
                  placeholder="Summary of the problem you have"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Product</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Transactions">Transactions</SelectItem>
                    <SelectItem value="Vault">Vault</SelectItem>
                    <SelectItem value="Inbox">Inbox</SelectItem>
                    <SelectItem value="Invoicing">Invoicing</SelectItem>
                    <SelectItem value="Tracker">Tracker</SelectItem>
                    <SelectItem value="AI">AI</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Severity</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none min-h-[150px]"
                  placeholder="Describe the issue you're facing, along with any relevant information. Please be as detailed and specific as possible."
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={sendSupport.status === "executing"} type="submit">
          {sendSupport.status === "executing" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
}
