import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <h1>Welcome to Harbor</h1>
      <p>This is a sample page.</p>
      <Link href="/login" className={buttonVariants()}>
        Login
      </Link>
    </div>
  );
}
