import { requireAuth } from "@/lib/auth-utils";

type PageProps = {
  params: Promise<{
    opportunityId: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  await requireAuth();
  const { opportunityId } = await params;
  return <p>M&A Opportunity id: {opportunityId}</p>;
};

export default Page;
