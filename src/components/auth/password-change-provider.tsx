"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChangePasswordDialog } from "@/features/auth/components/change-password-dialog";
import { useTRPC } from "@/trpc/client";

const PASSWORD_DIALOG_COOKIE_NAME = "password_change_dialog_shown";
const PASSWORD_DIALOG_COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

// Helper functions to manage cookies
function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts[1]?.split(";")[0] ?? null;
  }
  return null;
}

function setCookie(name: string, value: string, maxAge: number): void {
  if (typeof document === "undefined") {
    return;
  }
  // biome-ignore lint/suspicious/noDocumentCookie: We need to set cookies for dialog tracking
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
}

function removeCookie(name: string): void {
  if (typeof document === "undefined") {
    return;
  }
  // biome-ignore lint/suspicious/noDocumentCookie: We need to remove cookies for dialog tracking
  document.cookie = `${name}=; path=/; max-age=0`;
}

export function PasswordChangeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const previousPathnameRef = useRef<string | null>(null);
  const initialMountRef = useRef(true);
  const trpc = useTRPC();

  const {
    data: passwordStatus,
    isLoading,
    error,
  } = useQuery(trpc.users.getPasswordChangedStatus.queryOptions());

  const checkAndShowDialog = useCallback(() => {
    // Check if password hasn't been changed
    if (passwordStatus && !passwordStatus.passwordChanged) {
      // Check cookie to see if we've already shown it in the last 24 hours
      const hasShownIn24Hours = getCookie(PASSWORD_DIALOG_COOKIE_NAME);

      if (!hasShownIn24Hours) {
        setOpen(true);
        // Mark as shown with 24-hour expiration
        setCookie(
          PASSWORD_DIALOG_COOKIE_NAME,
          "true",
          PASSWORD_DIALOG_COOKIE_MAX_AGE
        );
      }
    }
  }, [passwordStatus]);

  // Track navigation changes (when user enters/navigates on platform)
  useEffect(() => {
    // On initial mount, just record the pathname
    if (initialMountRef.current) {
      initialMountRef.current = false;
      previousPathnameRef.current = pathname;
      return;
    }

    // User navigated to a different route
    if (previousPathnameRef.current !== pathname) {
      previousPathnameRef.current = pathname;
      checkAndShowDialog();
    }
  }, [pathname, checkAndShowDialog]);

  // Initial check when component mounts (user enters platform)
  useEffect(() => {
    if (passwordStatus) {
      checkAndShowDialog();
    }
  }, [passwordStatus, checkAndShowDialog]);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
    // Note: We don't remove the cookie when dialog is closed
    // This ensures it only shows once every 24 hours even if closed
  }, []);

  const handleSuccess = useCallback(() => {
    // Password changed successfully, clear cookie
    removeCookie(PASSWORD_DIALOG_COOKIE_NAME);
    setOpen(false);
  }, []);

  // Don't render dialog if loading, error, or password already changed
  if (isLoading || error || (passwordStatus?.passwordChanged ?? false)) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <ChangePasswordDialog
        onOpenChange={handleOpenChange}
        onSuccess={handleSuccess}
        open={open}
      />
    </>
  );
}
