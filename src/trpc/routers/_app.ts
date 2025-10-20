import {
  mergerAndAcquisitionRouter,
  opportunitiesRouter,
} from "@/features/opportunities/server/route";
import { usersRouter } from "@/features/users/server/route";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  mergerAndAcquisition: mergerAndAcquisitionRouter,
  users: usersRouter,
  opportunities: opportunitiesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
