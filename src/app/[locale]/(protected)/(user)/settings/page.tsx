import UpdateNameCard from "@/features/users/components/update-name-card";
import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
  const user = (await requireAuth()).user;
  return (
    <div className="flex h-full w-full flex-col gap-6">
      <UpdateNameCard initialName={user.name} />
    </div>
  );
};

export default Page;
