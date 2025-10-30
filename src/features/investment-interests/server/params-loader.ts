import type { SearchParams } from "nuqs/server";
import { z } from "zod";
import { PAGINATION } from "@/config/constants";

const investmentInterestsParamsSchema = z.object({
  page: z.coerce.number().default(PAGINATION.DEFAULT_PAGE),
  pageSize: z.coerce
    .number()
    .min(PAGINATION.MIN_PAGE_SIZE)
    .max(PAGINATION.MAX_PAGE_SIZE)
    .default(PAGINATION.DEFAULT_PAGE_SIZE),
  type: z.enum(["all", "m&a", "real-estate"]).default("all"),
  status: z.enum(["all", "pending", "processed"]).default("all"),
});

export const investmentInterestsParamsLoader = async (
  searchParams: Promise<SearchParams>
) => {
  const resolvedSearchParams = await searchParams;
  const params = await investmentInterestsParamsSchema.parseAsync({
    page: resolvedSearchParams.page,
    pageSize: resolvedSearchParams.pageSize,
    type: resolvedSearchParams.type,
    status: resolvedSearchParams.status,
  });

  return params;
};
