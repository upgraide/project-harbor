import { ChartAreaInteractive } from "@/components/admin-sidebar/chart-area-interactive";
import { DataTable } from "@/components/admin-sidebar/data-table";
import { SectionCards } from "@/components/admin-sidebar/section-cards";

import data from "./data.json";

export default function AdminIndexPage() {
  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </>
  );
}
