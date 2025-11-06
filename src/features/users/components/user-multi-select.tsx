"use client";

import { XIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { useTeamAndAdminUsers } from "@/features/users/hooks/use-team-and-admin-users";
import { cn } from "@/lib/utils";

type User = {
  id: string;
  name: string;
  email: string;
};

type UserMultiSelectProps = {
  value?: string[];
  action: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
};

export const UserMultiSelect = ({
  value = [],
  action,
  placeholder = "Select users",
  disabled = false,
}: UserMultiSelectProps) => {
  const { data: users, isLoading } = useTeamAndAdminUsers();
  const [open, setOpen] = useState(false);

  const selectedUsers =
    users?.filter((user: User) => value.includes(user.id)) ?? [];

  const handleToggle = (userId: string) => {
    if (value.includes(userId)) {
      action(value.filter((id) => id !== userId));
    } else {
      action([...value, userId]);
    }
  };

  const handleRemove = (userId: string, e: React.SyntheticEvent) => {
    e.stopPropagation();
    action(value.filter((id) => id !== userId));
  };

  if (isLoading) {
    return (
      <div className="flex h-9 items-center justify-center">
        <Spinner className="size-4" />
      </div>
    );
  }

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            "h-auto min-h-9 w-full justify-start text-left font-normal",
            !value.length && "text-muted-foreground"
          )}
          disabled={disabled}
          type="button"
          variant="outline"
        >
          {selectedUsers.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedUsers.map((user: User) => (
                <Badge className="mr-1" key={user.id} variant="secondary">
                  {user.name}
                  <button
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onClick={(e) => handleRemove(user.id, e)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.stopPropagation();
                        action(value.filter((id) => id !== user.id));
                      }
                    }}
                    type="button"
                  >
                    <XIcon className="size-3" />
                    <span className="sr-only">Remove {user.name}</span>
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
        {users?.map((user: User) => (
          <DropdownMenuCheckboxItem
            checked={value.includes(user.id)}
            key={user.id}
            onCheckedChange={() => handleToggle(user.id)}
          >
            <div className="flex flex-col">
              <span>{user.name}</span>
              <span className="text-muted-foreground text-xs">
                {user.email}
              </span>
            </div>
          </DropdownMenuCheckboxItem>
        ))}
        {users?.length === 0 && (
          <div className="px-2 py-1.5 text-muted-foreground text-sm">
            No users available
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
