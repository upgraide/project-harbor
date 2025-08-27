import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { homePath, privacyPath, termsPath } from "@/paths";
import ShaderBackground from "../(public)/_components/shader-background";

export const metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ShaderBackground>
      <div className="relative flex min-h-svh animate-fade-from-top flex-col items-center justify-center">
        <Link
          href={homePath()}
          className={buttonVariants({
            variant: "outline",
            className: "absolute top-4 left-4",
          })}
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>

        <div className="flex w-full max-w-sm flex-col gap-6">
          <Link
            href={homePath()}
            className="flex items-center gap-2 self-center font-medium text-2xl"
          >
            <Image
              src="/brand/logo-dark.png"
              alt="logo"
              width={250}
              height={250}
              className="block dark:hidden"
            />
            <Image
              src="/brand/logo-light.png"
              alt="logo"
              width={250}
              height={250}
              className="hidden dark:block"
            />
          </Link>

          {children}

          <div className="text-balance text-center text-muted text-xs">
            Ao clicar continuar, está a concordar com os{" "}
            <Link
              href={termsPath()}
              className="hover:text-primary hover:underline"
            >
              Termos de Serviço
            </Link>{" "}
            e a{" "}
            <Link
              href={privacyPath()}
              className="hover:text-primary hover:underline"
            >
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </ShaderBackground>
  );
};

export default AuthLayout;
