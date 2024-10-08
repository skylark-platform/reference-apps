import { graphQLClient } from "@skylark-apps/skylarktv/src/lib/skylark";
import { gql } from "graphql-request";

const PURGE_CACHE = gql`
  mutation PURGE_CACHE {
    purgeCache(all: true) {
      type
      uids
    }
  }
`;

// Sets a week long cache for Showcase environment Queries
const CACHE_MUTATION = gql`
  mutation CONFIGURE_QUERY_CACHE {
    setCacheConfig(
      rules: {
        max_age: 604800
        stale_while_revalidate: 604800
        types: ["Query"]
      }
    ) {
      rules {
        types
        stale_while_revalidate
        max_age
      }
    }
  }
`;

export const configureCache = async () => {
  await graphQLClient.uncachedRequest<{
    setCacheConfig: {
      rules: { type: string; stale_while_revalidate: number; max_age: number };
    };
  }>(CACHE_MUTATION);
};

export const purgeCache = async () => {
  await graphQLClient.uncachedRequest(PURGE_CACHE);
};
