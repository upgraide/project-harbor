"use client";

import { use } from "react";
import { CommissionDetail } from "@/features/commissions/components/commission-detail";

interface CommissionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CommissionDetailPage({
  params,
}: CommissionDetailPageProps) {
  const { id } = use(params);

  return (
    <div className="flex flex-col gap-6 p-6">
      <CommissionDetail commissionValueId={id} />
    </div>
  );
}
