import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireAuth();
  return <p>Real Estate Opportunities</p>;
};

export default Page;
