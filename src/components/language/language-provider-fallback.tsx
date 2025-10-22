import { Spinner } from "@/components/ui/spinner";

const LocationFallback = () => (
  <div className="flex h-screen flex-1 items-center justify-center">
    <Spinner className="size-6" />
  </div>
);

export { LocationFallback };
