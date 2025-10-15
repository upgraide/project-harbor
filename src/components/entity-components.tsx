import {
  AlertTriangleIcon,
  MoreVerticalIcon,
  PackageOpenIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";

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
}: EntityPaginationProps) => {
  const t = useScopedI18n("backoffice.entityComponents");
  return (
    <div className="flex w-full items-center justify-between gap-x-2">
      <div className="flex-1 text-muted-foreground text-sm">
        {`${t("page")} ${page} ${t("of")} ${totalPages || 1}`}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          disabled={disabled || page === 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          size="sm"
          variant="outline"
        >
          {t("previous")}
        </Button>
        <Button
          disabled={disabled || page === totalPages || totalPages === 0}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          size="sm"
          variant="outline"
        >
          {t("next")}
        </Button>
      </div>
    </div>
  );
};

type StateViewProps = {
  message?: string;
};

export const LoadingView = ({ message }: StateViewProps) => (
  <div className="flex h-full flex-1 flex-col items-center justify-center gap-y-4">
    <Spinner className="size-6 text-primary" />
    {!!message && <p className="text-muted-foreground text-sm">{message}</p>}
  </div>
);

export const ErrorView = ({ message }: StateViewProps) => (
  <div className="flex h-full flex-1 flex-col items-center justify-center gap-y-4">
    <AlertTriangleIcon className="size-6 text-primary" />
    {!!message && <p className="text-muted-foreground text-sm">{message}</p>}
  </div>
);

type EmptyViewProps = StateViewProps & {
  title?: string;
  newButtonLabel?: string;
  onNew?: () => void;
};

export const EmptyView = ({
  message,
  onNew,
  title,
  newButtonLabel,
}: EmptyViewProps) => (
  <Empty className="border border-dashed bg-accent">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <PackageOpenIcon />
      </EmptyMedia>
    </EmptyHeader>
    <EmptyTitle>{title || "No items"}</EmptyTitle>
    {!!message && <EmptyDescription>{message}</EmptyDescription>}
    {!!onNew && (
      <EmptyContent>
        <Button onClick={onNew}>
          <PlusIcon className="size-4" />
          {newButtonLabel || "Add new"}
        </Button>
      </EmptyContent>
    )}
  </Empty>
);

type EntityListProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey?: (item: T, index: number) => string | number;
  emptyView?: React.ReactNode;
  className?: string;
};

export function EntityList<T>({
  items,
  renderItem,
  getKey,
  emptyView,
  className,
}: EntityListProps<T>) {
  if (items.length === 0 && emptyView) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="mx-auto max-w-sm">{emptyView}</div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-y-4", className)}>
      {items.map((item, index) => (
        <div key={getKey ? getKey(item, index) : index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

type EntityItemProps = {
  href: string;
  title: string;
  subtitle?: React.ReactNode;
  image?: React.ReactNode;
  actions?: React.ReactNode;
  onRemove?: () => void | Promise<void>;
  isRemoving?: boolean;
  className?: string;
};

export const EntityItem = ({
  href,
  title,
  subtitle,
  image,
  actions,
  onRemove,
  isRemoving,
  className,
}: EntityItemProps) => {
  const t = useScopedI18n("backoffice.entityComponents");
  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isRemoving) {
      return;
    }

    if (onRemove) {
      await onRemove();
    }
  };
  return (
    <Link href={href} prefetch>
      <Card
        className={cn(
          "cursor-pointer p-4 shadow-none hover:shadow",
          isRemoving && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <CardContent className="flex flex-row items-center justify-between p-0">
          <div className="flex items-center gap-3">
            {image}
            <div>
              <CardTitle className="font-medium text-base">{title}</CardTitle>
              {!!subtitle && (
                <CardDescription className="text-xs">
                  {subtitle}
                </CardDescription>
              )}
            </div>
          </div>
          {(actions || onRemove) && (
            <div className="flex items-center gap-x-4">
              {actions}
              {!!onRemove && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      onClick={(e) => e.stopPropagation()}
                      size="icon"
                      variant="ghost"
                    >
                      <MoreVerticalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenuItem onClick={handleRemove}>
                      <TrashIcon className="size-4" />
                      {t("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
