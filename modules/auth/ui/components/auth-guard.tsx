"use client";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import type { ReactNode } from "react";
import { DynamicImage } from "@/components/dynamic-image";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import DarkLogo from "@/public/assets/logo-dark.png";
import LightLogo from "@/public/assets/logo-light.png";

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <AuthLoading>
        <div className="min-h-svh min-w-svw flex flex-col items-center justify-center">
          <DynamicImage
            alt="Logo"
            className="animate-pulse"
            darkSrc={LightLogo}
            height={250}
            lightSrc={DarkLogo}
            width={250}
          />
        </div>
      </AuthLoading>
      <Authenticated>{children}</Authenticated>
      <Unauthenticated>
        <SignInView />
      </Unauthenticated>
    </>
  );
};
