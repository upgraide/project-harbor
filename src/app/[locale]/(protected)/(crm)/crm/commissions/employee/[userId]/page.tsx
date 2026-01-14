import { HydrateClient } from "@/trpc/server";
import { requireAdmin } from "@/lib/auth-utils";
import { EmployeeCommissions } from "@/features/commissions/components/employee-commissions";

interface EmployeeCommissionsPageProps {
  params: Promise<{ userId: string }>;
}

export default async function EmployeeCommissionsPage({
  params,
}: EmployeeCommissionsPageProps) {
  await requireAdmin();
  const { userId } = await params;

  return (
    <div className="flex flex-col gap-6 p-6">
      <EmployeeCommissions userId={userId} />
    </div>
  );
}
