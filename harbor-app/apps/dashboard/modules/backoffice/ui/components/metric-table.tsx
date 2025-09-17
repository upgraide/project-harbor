import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@harbor-app/ui/components/table";
import { MetricTableRow } from "./metric-table-row";

interface MetricData {
  label: string;
  value: string | number | null | undefined;
  suffix?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

interface HeaderData {
  label: string;
  isHeader: true;
}

interface MetricTableProps {
  data: (MetricData | HeaderData)[];
}

export const MetricTable = ({ data }: MetricTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-6 py-4 font-medium">Metric</TableHead>
          <TableHead className="px-6 py-4 font-medium">Value</TableHead>
          <TableHead className="px-6 py-4 font-medium text-right">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <MetricTableRow
            isHeader={"isHeader" in item ? item.isHeader : false}
            key={`${item.label}-${index}`}
            label={item.label}
            onDelete={"onDelete" in item ? item.onDelete : undefined}
            onEdit={"onEdit" in item ? item.onEdit : undefined}
            suffix={"suffix" in item ? item.suffix : undefined}
            value={"value" in item ? item.value : undefined}
          />
        ))}
      </TableBody>
    </Table>
  );
};
