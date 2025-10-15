import { mergerAndAcquisitionRouter } from "@/features/opportunities/server/route";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  mergerAndAcquisition: mergerAndAcquisitionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
