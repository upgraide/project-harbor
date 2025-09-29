"use client";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import type { ReactNode } from "react";
import { DynamicImage } from "@/components/dynamic-image";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <AuthLoading>
        <div className="min-h-svh min-w-svw flex flex-col items-center justify-center">
          <DynamicImage
            alt="Logo"
            className="animate-pulse"
            darkSrc="/assets/logo-light.png"
            height={250}
            lightSrc="/assets/logo-dark.png"
            width={250}
          />
        </div>
      </AuthLoading>
      <Authenticated>{children}</Authenticated>
      <Unauthenticated>
        <AuthLayout>
          <SignInView />
        </AuthLayout>
      </Unauthenticated>
    </>
  );
};
