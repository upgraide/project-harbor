"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useInvestorUsers } from "@/features/users/hooks/use-investor-users";

type User = {
  id: string;
  name: string;
  email: string;
  companyName?: string | null;
};

const NONE_VALUE = "__none__";

type InvestorSelectProps = {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

/**
 * Select component for choosing investor users (USER role).
 * Used for "Pessoa investidora" - the user who invested in a deal.
 * This is NOT a commission role - just for record/display purposes.
 */
export const InvestorSelect = ({
  value,
  onValueChange,
  placeholder = "Select an investor",
  disabled = false,
}: InvestorSelectProps) => {
  const { data: users, isLoading } = useInvestorUsers();

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

  const getDisplayName = (user: User) => {
    if (user.companyName) {
      return `${user.name} (${user.companyName})`;
    }
    return `${user.name} (${user.email})`;
  };

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
            {getDisplayName(user)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
