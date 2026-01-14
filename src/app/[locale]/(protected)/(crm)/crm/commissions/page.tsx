import { Metadata } from "next";
import { Suspense } from "react";
import { CommissionsContainer } from "@/features/commissions/components/commissions-container";
import { requireTeam } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Commissions | CRM",
  description: "Manage commission rates and view commission-eligible projects",
};

const Page = async () => {
  await requireTeam();

  return (
    <div className="flex flex-col gap-6 p-6">
      <CommissionsContainer />
    </div>
  );
};

export default Page;
