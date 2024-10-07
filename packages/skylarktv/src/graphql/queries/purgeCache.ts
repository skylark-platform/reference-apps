import { gql } from "graphql-request";

export const PURGE_CACHE = gql`
  mutation PURGE_CACHE {
    purgeCache(all: true) {
      type
      uids
    }
  }
`;
