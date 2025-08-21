"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { homePath, registerPath } from "@/paths";
import { Loader, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const LoginForm = () => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bem-vindo de volta!</CardTitle>
        <CardDescription>Insira as credenciais de acesso</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@exemplo.com"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>

          <Button className="w-full" disabled={pending}>
            {pending ? (
              <>
                <Loader className="size-4 animate-spin" />
                <span>A carregar...</span>
              </>
            ) : (
              <>
                <Send className="size-4" />
                <span>Continuar</span>
              </>
            )}
          </Button>

          <div className="text-balance text-center text-muted-foreground text-xs">
            <Link
              href={registerPath()}
              className="hover:text-primary hover:underline"
            >
              Não tem uma conta? Pedir acesso
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
