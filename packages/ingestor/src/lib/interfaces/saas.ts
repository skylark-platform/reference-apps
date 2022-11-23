export interface GraphQLBaseObject {
  __typename?: string;
  uid: string;
  external_id: string;
  slug: string;
}

export interface GraphQLMetadata {
  images: GraphQLBaseObject[];
  roles: GraphQLBaseObject[];
  people: GraphQLBaseObject[];
  themes: GraphQLBaseObject[];
  genres: GraphQLBaseObject[];
  ratings: GraphQLBaseObject[];
  tags: GraphQLBaseObject[];
  credits: GraphQLBaseObject[];
  availability: {
    default?: string;
    all: string[];
  };
  dimensions: {
    affiliates: GraphQLBaseObject[];
    deviceTypes: GraphQLBaseObject[];
    customerTypes: GraphQLBaseObject[];
    locales: GraphQLBaseObject[];
    operatingSystems: GraphQLBaseObject[];
    regions: GraphQLBaseObject[];
    viewingContext: GraphQLBaseObject[];
  };
}

export type GraphQLIntrospectionKind =
  | "SCALAR"
  | "ENUM"
  | "INPUT_OBJECT"
  | "NON_NULL";

export interface GraphQLIntrospection {
  IntrospectionOnType: {
    name: string;
    fields: {
      name: string;
      type: {
        name: string;
        kind: GraphQLIntrospectionKind;
      };
    }[];
  };
  IntrospectionOnInputType: {
    name: string;
    inputFields: {
      name: string;
      type: {
        name: string;
        kind: GraphQLIntrospectionKind;
      };
    }[];
  } | null;
}

export interface GraphQLIntrospectionProperties {
  property: string;
  kind: GraphQLIntrospectionKind;
}

export interface GraphQLDimension {
  uid: string;
  title: string;
  slug: string;
  description?: string;
}
