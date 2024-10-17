import { gql } from "graphql-request";

export const GET_USER = gql`
  query GET_USER {
    getUser {
      account
      role
      permissions
    }
  }
`;
