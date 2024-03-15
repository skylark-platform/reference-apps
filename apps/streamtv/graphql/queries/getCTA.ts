import { gql } from "graphql-request";

export const GET_CTA = gql`
  query GET_CTA(
    $uid: String
    $externalId: String
    $language: String!
    $deviceType: String!
    $customerType: String!
    $region: String!
  ) {
    getObject: getCallToAction(
      uid: $uid
      external_id: $externalId
      language: $language
      dimensions: [
        { dimension: "device-types", value: $deviceType }
        { dimension: "customer-types", value: $customerType }
        { dimension: "regions", value: $region }
      ]
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
