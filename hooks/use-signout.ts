import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { signInPath } from "@/lib/paths";
import { useScopedI18n } from "@/locales/client";

export function useLogout() {
  const t = useScopedI18n("dashboard.navigation");
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(signInPath());
          toast.success(t("toastLogoutSuccess"));
        },
        onError: () => {
          toast.error(t("toastLogoutError"));
        },
      },
    });
  };

  return { handleLogout };
}
