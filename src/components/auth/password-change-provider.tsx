"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChangePasswordDialog } from "@/features/auth/components/change-password-dialog";
import { useTRPC } from "@/trpc/client";

const SESSION_STORAGE_KEY = "password-change-dialog-shown";

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
      // Check sessionStorage to see if we've already shown it in this session
      const hasShownInSession = sessionStorage.getItem(SESSION_STORAGE_KEY);

      if (!hasShownInSession) {
        setOpen(true);
        // Mark as shown in this session
        sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
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

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
      // If dialog is closed without changing password, remove the session flag
      // so it can show again on next navigation
      if (!newOpen && passwordStatus && !passwordStatus.passwordChanged) {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    },
    [passwordStatus]
  );

  const handleSuccess = useCallback(() => {
    // Password changed successfully, clear session flag
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
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
