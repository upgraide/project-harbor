import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";

const Page = async () => {
  await requireAuth();

  const data = await caller.getUsers();

  return (
    <div className="flex min-h-screen min-w-screen flex-col items-center justify-center gap-6">
      protected server component
      <div>{JSON.stringify(data)}</div>
    </div>
  );
};

export default Page;
