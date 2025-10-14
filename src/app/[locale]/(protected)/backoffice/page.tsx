"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";

const Page = () => {
  const trpc = useTRPC();
  const data = useQuery(trpc.getOpportunities.queryOptions());

  const create = useMutation(
    trpc.createOpportunity.mutationOptions({
      onSuccess: () => {
        toast.success("Opportunity queued");
      },
    })
  );

  const testAI = useMutation(
    trpc.testAI.mutationOptions({
      onSuccess: () => {
        toast.success("AI execution queued");
      },
    })
  );

  return (
    <div className="flex min-h-screen min-w-screen flex-col items-center justify-center gap-6">
      protected server component
      <div>{JSON.stringify(data, null, 2)}</div>
      <Button disabled={testAI.isPending} onClick={() => testAI.mutate()}>
        Test AI
      </Button>
      <Button disabled={create.isPending} onClick={() => create.mutate()}>
        Create Opportunity
      </Button>
    </div>
  );
};

export default Page;
