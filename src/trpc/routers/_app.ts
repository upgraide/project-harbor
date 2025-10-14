import { opportunitiesRouter } from "@/features/opportunities/server/route";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  opportunities: opportunitiesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
