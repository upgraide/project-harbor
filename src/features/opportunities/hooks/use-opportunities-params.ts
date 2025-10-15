import { useQueryStates } from "nuqs";
import { opportunityParams } from "../params";

export const useOpportunitiesParams = () => useQueryStates(opportunityParams);
