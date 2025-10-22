import { Creator } from "@/features/creator/components/m&a-creator";
import { requireTeam } from "@/lib/auth-utils";

const Page = async () => {
  await requireTeam();

  return (
    <main className="flex-1">
      <Creator />
    </main>
  );
};

export default Page;
