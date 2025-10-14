import { RequestAccessForm } from "@/features/auth/components/request-access-form";
import { requireUnAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnAuth();
  return <RequestAccessForm />;
};

export default Page;
