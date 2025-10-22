import { useQueryStates } from "nuqs";
import { usersParams } from "../params";

export const useUsersParams = () => useQueryStates(usersParams);
