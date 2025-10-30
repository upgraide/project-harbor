import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { PAGINATION } from "@/config/constants";

export const useInvestmentInterestsParams = () =>
  useQueryStates(
    {
      page: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE),
      pageSize: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE_SIZE),
      type: parseAsStringEnum(["all", "m&a", "real-estate"]).withDefault("all"),
      status: parseAsStringEnum(["all", "pending", "processed"]).withDefault(
        "all"
      ),
      search: parseAsString.withDefault(""),
    },
    {
      history: "push",
      shallow: false,
    }
  );
