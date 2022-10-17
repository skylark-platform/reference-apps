import React from "react";

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
    type: string;
  }[];
  rating: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CollectionItemDataFetcher: any;
}

export const CollectionPage: React.FC<Props> = () => (
  <div className="mb-20 mt-48 flex min-h-screen w-full flex-col items-center bg-gray-900 font-body"></div>
);
