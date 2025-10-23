import UpdateAvatarCard from "@/features/users/components/update-avatar-card";
import UpdateNameCard from "@/features/users/components/update-name-card";
import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
  const user = (await requireAuth()).user;
  return (
    <div className="flex h-full w-full flex-col gap-6">
      <UpdateAvatarCard initialImage={user.image} />
      <UpdateNameCard initialName={user.name} />
    </div>
  );
};

export default Page;
