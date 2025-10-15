import { PlusIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type EntityHeaderProps = {
  title: string;
  description?: string;
  newButtonLabel: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { newButtonHref: string; onNew?: never }
  | { newButtonHref?: never; onNew?: never }
);

export const EntityHeader = ({
  title,
  description,
  newButtonLabel,
  disabled,
  isCreating,
  onNew,
  newButtonHref,
}: EntityHeaderProps) => (
  <div className="flex flex-row items-center justify-between gap-x-4">
    <div className="flex flex-col">
      <h1 className="font-semibold text-lg md:text-xl">{title}</h1>
      {description && (
        <p className="text-muted-foreground text-xs md:text-sm">
          {description}
        </p>
      )}
    </div>
    {onNew && !newButtonHref && (
      <Button disabled={disabled || isCreating} onClick={onNew} size="sm">
        <PlusIcon className="size-4" />
        {newButtonLabel}
      </Button>
    )}
    {newButtonHref && !onNew && (
      <Button asChild size="sm">
        <Link href={newButtonHref} prefetch>
          <PlusIcon className="size-4" />
          {newButtonLabel}
        </Link>
      </Button>
    )}
  </div>
);

type EntityContainerProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
};

export const EntityContainer = ({
  children,
  header,
  search,
  pagination,
}: EntityContainerProps) => (
  <div className="h-full p-4 md:px-10 md:py-6">
    <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col gap-y-8">
      {header}
      <div className="flex h-full flex-col gap-y-4">
        {search}
        {children}
      </div>
      {pagination}
    </div>
  </div>
);

type EntitySearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const EntitySearch = ({
  value,
  onChange,
  placeholder = "Search",
}: EntitySearchProps) => (
  <div className="relative ml-auto">
    <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-3.5 text-muted-foreground" />
    <Input
      className="max-w-[200px] border-border bg-background pl-8 shadow-none"
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      value={value}
    />
  </div>
);

type EntityPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

export const EntityPagination = ({
  page,
  totalPages,
  onPageChange,
  disabled,
}: EntityPaginationProps) => (
  <div className="flex w-full items-center justify-between gap-x-2">
    <div className="flex-1 text-muted-foreground text-sm">
      {`Page ${page} of ${totalPages || 1}`}
    </div>
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button
        disabled={disabled || page === 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
        size="sm"
        variant="outline"
      >
        Previous
      </Button>
      <Button
        disabled={disabled || page === totalPages || totalPages === 0}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        size="sm"
        variant="outline"
      >
        Next
      </Button>
    </div>
  </div>
);
