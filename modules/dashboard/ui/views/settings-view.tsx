import UpdateAvatarCard from "../components/update-avatar-card";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { getToken } from "@/lib/auth-server";

const SettingsView = async () => {
  const token = await getToken();

  const preloadedUser = await preloadQuery(
    api.auth.getCurrentUser,
    {},
    { token },
  );

  return (
    <div className="flex h-full w-full flex-col gap-6">
      <UpdateAvatarCard preloadedUser={preloadedUser} />
    </div>
  );
};

export default SettingsView;
