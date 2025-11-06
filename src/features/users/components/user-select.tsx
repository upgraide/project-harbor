"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useTeamAndAdminUsers } from "@/features/users/hooks/use-team-and-admin-users";

type User = {
  id: string;
  name: string;
  email: string;
};

const NONE_VALUE = "__none__";

type UserSelectProps = {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export const UserSelect = ({
  value,
  onValueChange,
  placeholder = "Select a user",
  disabled = false,
}: UserSelectProps) => {
  const { data: users, isLoading } = useTeamAndAdminUsers();

  if (isLoading) {
    return (
      <div className="flex h-9 items-center justify-center">
        <Spinner className="size-4" />
      </div>
    );
  }

  const handleValueChange = (newValue: string) => {
    if (newValue === NONE_VALUE) {
      onValueChange("");
    } else {
      onValueChange(newValue);
    }
  };

  const selectValue = value && value !== "" ? value : NONE_VALUE;

  return (
    <Select
      disabled={disabled}
      onValueChange={handleValueChange}
      value={selectValue}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NONE_VALUE}>None</SelectItem>
        {users?.map((user: User) => (
          <SelectItem key={user.id} value={user.id}>
            {user.name} ({user.email})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
