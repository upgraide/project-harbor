import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { PAGINATION } from "@/config/constants";

export const useInvestorsParams = () =>
  useQueryStates(
    {
      page: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE),
      pageSize: parseAsInteger
        .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
        .withOptions({
          validate: (value) => {
            if (value < PAGINATION.MIN_PAGE_SIZE) {
              return PAGINATION.MIN_PAGE_SIZE;
            }
            if (value > PAGINATION.MAX_PAGE_SIZE) {
              return PAGINATION.MAX_PAGE_SIZE;
            }
            return value;
          },
        }),
      investorType: parseAsString.withDefault("all"),
      interestSegment: parseAsString.withDefault("all"),
      industry: parseAsString.withDefault("all"),
      search: parseAsString.withDefault(""),
    },
    {
      history: "push",
      shallow: false,
    }
  );
