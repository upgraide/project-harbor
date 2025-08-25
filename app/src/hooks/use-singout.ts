"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { homePath } from "@/paths";

export function useSignOut() {
  const router = useRouter();

  const handleSignOut = async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(homePath());
          toast.success("Saiu com sucesso!");
        },
        onError: () => {
          toast.error("Erro ao sair");
        },
      },
    });
  };

  return handleSignOut;
}
