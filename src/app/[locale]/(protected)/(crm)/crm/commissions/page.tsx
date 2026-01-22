import { Metadata } from "next";
import { CommissionsContainer } from "@/features/commissions/components/commissions-container";
import { requireTeam } from "@/lib/auth-utils";
import { HydrateClient, trpc, prefetch } from "@/trpc/server";
import { Role } from "@/generated/prisma";

export const metadata: Metadata = {
  title: "Commissions | CRM",
  description: "Manage commission rates and view commission-eligible projects",
};

const Page = async () => {
  const { role } = await requireTeam();
  
  // Prefetch admin queries if user is admin
  if (role === Role.ADMIN) {
    prefetch(trpc.commissions.getEmployeeSummary.queryOptions());
    prefetch(trpc.commissions.getPendingCommissions.queryOptions());
  }

  return (
    <HydrateClient>
      <div className="flex flex-col gap-6 p-6">
        <CommissionsContainer />
      </div>
    </HydrateClient>
  );
};

export default Page;
