import { gql } from "graphql-request";

// No Portuguese Genres have been added to the ingestor yet
export const LIST_GENRES = gql`
  query LIST_GENRES($customerType: String!, $nextToken: String) {
    listObjects: listGenre(
      dimensions: [{ dimension: "customer-types", value: $customerType }]
      next_token: $nextToken
      limit: 10
    ) {
      next_token
      objects {
        uid
        name
      }
    }
  }
`;
