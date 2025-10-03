import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import UpdateAvatarCard from "../components/update-avatar-card";
import UpdateNameCard from "../components/update-name-card";

const SettingsView = async () => {
  const token = await getToken();

  const preloadedUser = await preloadQuery(
    api.auth.getCurrentUser,
    {},
    { token }
  );

  return (
    <div className="flex h-full w-full flex-col gap-6">
      <UpdateAvatarCard preloadedUser={preloadedUser} />
      <UpdateNameCard preloadedUser={preloadedUser} />
    </div>
  );
};

export default SettingsView;
