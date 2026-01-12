import { Suspense } from "react";
import { InvestorDetailContainer } from "@/features/investors/components/investor-detail-container";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function InvestorDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvestorDetailContainer investorId={id} />
    </Suspense>
  );
}
