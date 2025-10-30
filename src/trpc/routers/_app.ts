import { accessRequestRouter } from "@/features/auth/server/route";
import { investmentInterestsRouter } from "@/features/investment-interests/server/route";
import { investorsRouter } from "@/features/investors/server/route";
import { analyticsRouter } from "@/features/opportunities/server/analytics";
import {
  mergerAndAcquisitionRouter,
  opportunitiesRouter,
  realEstateRouter,
} from "@/features/opportunities/server/route";
import { userInterestRouter } from "@/features/opportunities/server/user-interest";
import { usersRouter } from "@/features/users/server/route";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  mergerAndAcquisition: mergerAndAcquisitionRouter,
  users: usersRouter,
  investors: investorsRouter,
  opportunities: opportunitiesRouter,
  realEstate: realEstateRouter,
  analytics: analyticsRouter,
  userInterest: userInterestRouter,
  investmentInterests: investmentInterestsRouter,
  accessRequest: accessRequestRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
