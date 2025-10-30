import type { SearchParams } from "nuqs/server";
import { createLoader } from "nuqs/server";
import { opportunityParams } from "../params";

const loader = createLoader(opportunityParams);

export const opportunityParamsLoader = async (
  searchParams: Promise<SearchParams>
) => {
  const params = await searchParams;
  return loader(params);
};
