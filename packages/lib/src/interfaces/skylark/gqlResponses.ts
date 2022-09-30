import { ApiEntertainmentObject } from "./apiResponses";

export interface GQLMultipleEntertainmentObjects {
  content: {
    objects: ApiEntertainmentObject[];
  };
}
