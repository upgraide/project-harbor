import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireAuth();
  return <p>M&A Opportunities</p>;
};

export default Page;
