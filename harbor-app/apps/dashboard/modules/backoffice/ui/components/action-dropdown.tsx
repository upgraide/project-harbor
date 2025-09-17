import { Button } from "@harbor-app/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@harbor-app/ui/components/dropdown-menu";
import { MoreHorizontalIcon, TrashIcon, WandSparklesIcon } from "lucide-react";

interface ActionDropdownProps {
  onEdit?: () => void;
  onDelete?: () => void;
  editText?: string;
  deleteText?: string;
}

export const ActionDropdown = ({
  onEdit,
  onDelete,
  editText = "Edit",
  deleteText = "Delete",
}: ActionDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-8 p-0" size="sm" variant="ghost">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <WandSparklesIcon className="size-4 mr-2" />
            {editText}
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem className="text-destructive" onClick={onDelete}>
            <TrashIcon className="size-4 mr-2" />
            {deleteText}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
