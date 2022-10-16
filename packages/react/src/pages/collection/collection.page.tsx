import React from "react";
import { GraphQLMediaObjectTypes } from "@skylark-reference-apps/lib";

export interface CollectionPageParsedContentItem {
  slug: string;
  uid: string;
  title: string;
  synopsis: string;
  image: string;
  href: string;
  duration?: string;
  releaseDate?: string;
}

interface Props {
  loading?: boolean;
  bgImage: string;
  title: string;
  synopsis: string;
  releaseDate?: string;
  content: {
    slug: string;
    self: string;
    uid: string;
    type: GraphQLMediaObjectTypes | "";
  }[];
  rating: string;
  CollectionItemDataFetcher:
    | React.FC<{
        slug: string;
        self: string;
        children(data: CollectionPageParsedContentItem): React.ReactNode;
      }>
    | React.FC<{
        uid: string;
        type: GraphQLMediaObjectTypes;
        children(data: CollectionPageParsedContentItem): React.ReactNode;
      }>;
}

export const CollectionPage: React.FC<Props> = () => (
  <div className="mb-20 mt-48 flex min-h-screen w-full flex-col items-center bg-gray-900 font-body"></div>
);
