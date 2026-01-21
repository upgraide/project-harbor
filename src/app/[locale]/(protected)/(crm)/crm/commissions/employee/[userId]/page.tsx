import { EmployeeCommissions } from "@/features/commissions/components/employee-commissions";
import { HydrateClient, trpc, prefetch } from "@/trpc/server";
import { requireAdmin } from "@/lib/auth-utils";

interface EmployeeCommissionsPageProps {
  params: Promise<{ userId: string }>;
}

export default async function EmployeeCommissionsPage({
  params,
}: EmployeeCommissionsPageProps) {
  await requireAdmin();
  const { userId } = await params;

  // Prefetch employee commissions data
  prefetch(trpc.commissions.getEmployeeCommissions.queryOptions({ userId }));

  return (
    <HydrateClient>
      <div className="flex flex-col gap-6 p-6">
        <EmployeeCommissions userId={userId} />
      </div>
    </HydrateClient>
  );
}
