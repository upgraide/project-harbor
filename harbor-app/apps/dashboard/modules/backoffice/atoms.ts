import type { Doc } from "@harbor-app/backend/convex/_generated/dataModel";
import { atomWithStorage } from "jotai/utils";
import { STATUS_FILTER_KEY } from "./constants";

export const statusFilterAtom = atomWithStorage<
  Doc<"opportunitiesMergersAndAcquisitions">["status"] | "all"
>(STATUS_FILTER_KEY, "all");
