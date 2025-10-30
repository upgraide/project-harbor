import type { SearchParams } from "nuqs/server";
import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";
import { PAGINATION } from "@/config/constants";

export const investorsParamsLoader = async (
  searchParams: Promise<SearchParams>
) => {
  const params = await searchParams;
  const page = parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE)
    .parseServerSide(params.page);
  const pageSize = parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
    .parseServerSide(params.pageSize);
  const investorType = parseAsStringEnum([
    "all",
    "<€10M",
    "€10M-€100M",
    ">€100M",
  ])
    .withDefault("all")
    .parseServerSide(params.investorType);
  const interestSegment = parseAsStringEnum(["all", "CRE", "M&A"])
    .withDefault("all")
    .parseServerSide(params.interestSegment);
  const industry = parseAsString
    .withDefault("all")
    .parseServerSide(params.industry);
  const search = parseAsString.withDefault("").parseServerSide(params.search);

  return { page, pageSize, investorType, interestSegment, industry, search };
};
