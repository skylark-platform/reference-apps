import { graphQLClient } from "@skylark-reference-apps/lib";
import { gql } from "graphql-request";

// Sets a 24 hour query cache for Showcase environment
const CACHE_MUTATION = gql`
  mutation CONFIGURE_24HR_QUERY_CACHE {
    setCacheConfig(
      rules: { max_age: 86400, stale_while_revalidate: 86400, types: ["Query"] }
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
