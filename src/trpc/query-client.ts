import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";

const SECONDS_IN_MS = 1000;
const NUM_SECONDS = 30;
const STALE_TIME = NUM_SECONDS * SECONDS_IN_MS;

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME,
      },
      dehydrate: {
        // serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        // deserializeData: superjson.deserialize,
      },
    },
  });
}
