import { Record, FieldSet } from "airtable";

export interface GraphQLBaseObject {
  __typename?: string;
  uid: string;
  external_id: string;
  slug: string;
}

export interface GraphQLMetadata {
  airtableImages: Record<FieldSet>[];
  roles: GraphQLBaseObject[];
  people: GraphQLBaseObject[];
  themes: GraphQLBaseObject[];
  genres: GraphQLBaseObject[];
  ratings: GraphQLBaseObject[];
  tags: GraphQLBaseObject[];
  credits: GraphQLBaseObject[];
}
