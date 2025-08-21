import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";

export default function Page() {
  return (
    <div>
      <h1>Welcome to Harbor</h1>
      <p>This is a sample page.</p>
      <Link href="/login" className={buttonVariants()}>
        Login
      </Link>
      <ModeToggle />
    </div>
  );
}
