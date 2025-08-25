import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import InviteNewUserForm from "./_components/invite-new-user-form";

export default function ActivateAccountPage() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <Card className="mt-32">
        <CardHeader>
          <CardTitle>Convidar novo utilizador</CardTitle>
          <CardDescription>
            Convide um novo utilizador para a plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InviteNewUserForm />
        </CardContent>
      </Card>
    </div>
  );
}
