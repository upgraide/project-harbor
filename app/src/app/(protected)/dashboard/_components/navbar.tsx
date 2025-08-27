"use client";

import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { dashboardPath } from "@/paths";
import IconDark from "../../../../../public/brand/icon-dark.png";
import IconLight from "../../../../../public/brand/icon-light.png";
import { UserDropdown } from "./user-dropdown";

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex min-h-16 items-center px-4 md:px-6 lg:px-8">
        <Link
          href={dashboardPath()}
          className="mr-4 flex items-center space-x-2"
        >
          <Image
            src={IconDark}
            alt="logo"
            className="block dark:hidden size-9"
          />
          <Image
            src={IconLight}
            alt="logo"
            className="hidden dark:block size-9"
          />
          <span className="font-bold hidden md:block">Harbor Partners</span>
        </Link>

        <nav className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-2"></div>

          <div className="flex items-center space-x-4">
            <ModeToggle />

            {isPending ? (
              <Skeleton className="h-8 w-8 rounded-full" />
            ) : session ? (
              <UserDropdown
                name={
                  session?.user.name && session.user.name.length > 0
                    ? session.user.name
                    : session?.user.email.split("@")[0]
                }
                email={session.user.email}
                image={
                  session?.user.image ??
                  `https://avatar.vercel.sh/${session?.user.email}`
                }
              />
            ) : null}
          </div>
        </nav>
      </div>
    </header>
  );
}
