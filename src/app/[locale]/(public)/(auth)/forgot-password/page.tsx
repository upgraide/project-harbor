import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { requireUnAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnAuth();
  return <ForgotPasswordForm />;
};

export default Page;
