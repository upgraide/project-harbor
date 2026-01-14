"use client";

import { use } from "react";
import { EmployeeCommissions } from "@/features/commissions/components/employee-commissions";

interface EmployeeCommissionsPageProps {
  params: Promise<{ userId: string }>;
}

export default function EmployeeCommissionsPage({
  params,
}: EmployeeCommissionsPageProps) {
  const { userId } = use(params);

  return (
    <div className="flex flex-col gap-6 p-6">
      <EmployeeCommissions userId={userId} />
    </div>
  );
}
