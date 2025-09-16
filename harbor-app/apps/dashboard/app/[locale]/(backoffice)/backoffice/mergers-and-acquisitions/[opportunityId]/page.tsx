const Page = async ({
  params,
}: {
  params: Promise<{ opportunityId: string }>;
}) => {
  const { opportunityId } = await params;

  return <div>Opportunity ID {opportunityId}</div>;
};

export default Page;