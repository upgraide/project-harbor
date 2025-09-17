import { TableCell, TableRow } from "@harbor-app/ui/components/table";
import { ActionDropdown } from "./action-dropdown";

interface MetricTableRowProps {
  label: string;
  value: string | number | null | undefined;
  suffix?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  isHeader?: boolean;
  className?: string;
}

export const MetricTableRow = ({
  label,
  value,
  suffix = "",
  onEdit,
  onDelete,
  isHeader = false,
  className = "",
}: MetricTableRowProps) => {
  const displayValue = value || "-";
  const hasValue = value !== null && value !== undefined && value !== "";

  if (isHeader) {
    return (
      <TableRow>
        <TableCell className={`px-6 py-4 font-medium bg-muted/50 ${className}`}>
          {label}
        </TableCell>
        <TableCell
          className={`px-6 py-4 font-medium bg-muted/50 ${className}`}
        ></TableCell>
        <TableCell
          className={`px-6 py-4 font-medium bg-muted/50 ${className}`}
        ></TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="px-6 py-4">{label}</TableCell>
      <TableCell className="px-6 py-4 text-muted-foreground">
        {displayValue}
        {hasValue && suffix && <span>{suffix}</span>}
      </TableCell>
      <TableCell className="px-6 py-4 flex items-center justify-end">
        <ActionDropdown onDelete={onDelete} onEdit={onEdit} />
      </TableCell>
    </TableRow>
  );
};
