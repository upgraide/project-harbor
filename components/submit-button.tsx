import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SubmitButton({
  children,
  isSubmitting,
  disabled,
  ...props
}: {
  children: React.ReactNode;
  isSubmitting: boolean;
  disabled?: boolean;
} & React.ComponentProps<typeof Button>) {
  return (
    <Button
      disabled={isSubmitting || disabled}
      {...props}
      className={cn("relative", props.className)}
    >
      <span className={cn(isSubmitting && "invisible")}>{children}</span>
      {isSubmitting && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader className="size-4 animate-spin" />
        </div>
      )}
    </Button>
  );
}
