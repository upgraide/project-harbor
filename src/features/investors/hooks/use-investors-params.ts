import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { PAGINATION } from "@/config/constants";

export const useInvestorsParams = () =>
  useQueryStates(
    {
      page: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE),
      pageSize: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE_SIZE),
      investorType: parseAsStringEnum([
        "all",
        "<€10M",
        "€10M-€100M",
        ">€100M",
      ]).withDefault("all"),
      interestSegment: parseAsStringEnum(["all", "CRE", "M&A"]).withDefault(
        "all"
      ),
      industry: parseAsString.withDefault("all"),
      search: parseAsString.withDefault(""),
    },
    {
      history: "push",
      shallow: false,
    }
  );
