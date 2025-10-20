import { Creator } from "@/features/creator/components/real-estate-creator";
import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireAuth();

  return (
    <main className="flex-1">
      <Creator />
    </main>
  );
};

export default Page;
