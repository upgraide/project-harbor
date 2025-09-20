"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { signInPath } from "@/lib/paths";

export default function DashboardPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push(signInPath());
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <Button onClick={handleSignOut}>Sign Out</Button>
    </div>
  );
}
