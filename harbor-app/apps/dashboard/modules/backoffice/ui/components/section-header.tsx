import { Button } from "@harbor-app/ui/components/button";
import { PencilIcon, PlusIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  onAddClick?: () => void;
  onEditClick?: () => void;
  addButtonText?: string;
  editButtonText?: string;
  showAddButton?: boolean;
  showEditButton?: boolean;
}

export const SectionHeader = ({
  title,
  onAddClick,
  onEditClick,
  addButtonText = "Add",
  editButtonText = "Edit",
  showAddButton = false,
  showEditButton = false,
}: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b px-6 py-4">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex gap-2">
        {showEditButton && onEditClick && (
          <Button onClick={onEditClick} size="sm">
            <PencilIcon className="size-4 mr-2" />
            {editButtonText}
          </Button>
        )}
        {showAddButton && onAddClick && (
          <Button onClick={onAddClick} size="sm">
            <PlusIcon className="size-4 mr-2" />
            {addButtonText}
          </Button>
        )}
      </div>
    </div>
  );
};
