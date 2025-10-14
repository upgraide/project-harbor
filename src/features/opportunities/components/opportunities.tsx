import { useSuspenseOpportunities } from "../hooks/use-opportunities";

export const OpportunitiesList = () => {
  const opportunities = useSuspenseOpportunities();

  return <p>{JSON.stringify(opportunities.data, null, 2)}</p>;
};
