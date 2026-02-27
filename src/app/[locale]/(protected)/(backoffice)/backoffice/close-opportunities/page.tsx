import type { SearchParams } from "nuqs/server";
import { CloseOpportunitiesList } from "@/features/close-opportunities/components/close-opportunities-list";
import { requireTeam } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
  await requireTeam();

  return (
    <HydrateClient>
      <CloseOpportunitiesList />
    </HydrateClient>
  );
};

export default Page;
