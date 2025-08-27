import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { adminProjectCreatePath } from "@/paths";

export default function AdminProjectsPage() {
  return (
    <>
      <div className="flex justify-end">
        <Link className={buttonVariants()} href={adminProjectCreatePath()}>
          <PlusIcon className=" h-4 w-4" />
          Criar Projeto
        </Link>
      </div>
      <div>Aqui você pode gerenciar seus projetos.</div>
    </>
  );
}
