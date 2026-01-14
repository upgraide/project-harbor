"use client";

import { use } from "react";
import { CommissionDetail } from "@/features/commissions/components/commission-detail";

interface CommissionDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ opportunityId?: string; commissionId?: string; roleType?: string; userId?: string }>;
}

export default function CommissionDetailPage({
  params,
  searchParams,
}: CommissionDetailPageProps) {
  const { id } = use(params);
  const search = use(searchParams);

  // Redirect old-style /[id] to new query param style for consistency
  if (id !== 'detail' && !search.opportunityId) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <CommissionDetail 
          commissionValueId={id}
          roleType={search.roleType}
          userId={search.userId}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <CommissionDetail 
        opportunityId={search.opportunityId}
        commissionId={search.commissionId}
        roleType={search.roleType}
        userId={search.userId}
      />
    </div>
  );
}
