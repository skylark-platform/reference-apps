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
    default?: GraphQLBaseObject;
    always?: GraphQLBaseObject;
    all: GraphQLBaseObject[];
  };
  dimensions: {
    affiliates: GraphQLBaseObject[];
    deviceTypes: GraphQLBaseObject[];
    customerTypes: GraphQLBaseObject[];
    languages: GraphQLBaseObject[];
    locales: GraphQLBaseObject[];
    operatingSystems: GraphQLBaseObject[];
    regions: GraphQLBaseObject[];
    viewingContext: GraphQLBaseObject[];
  };
}

export interface GraphQLIntrospection {
  __type: {
    name: string;
    fields: {
      name: string;
      type: {
        name: string;
        kind: string;
      };
    }[];
  };
}

export interface GraphQLDimension {
  uid: string;
  title: string;
  slug: string;
  description?: string;
  _meta: {
    values: GraphQLBaseObject[];
  };
}
