import { gql } from "graphql-request";

export const GET_CTA = gql`
  query GET_CTA(
    $uid: String
    $externalId: String
    $language: String!
    $customerType: String!
  ) {
    getObject: getCallToAction(
      uid: $uid
      external_id: $externalId
      language: $language
      dimensions: [{ dimension: "customer-types", value: $customerType }]
    ) {
      uid
      text
      text_short
      description
      description_short
      url
      url_path
    }
  }
`;
