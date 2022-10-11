import React from "react";
import {
  formatReleaseDate,
  formatYear,
  GraphQLMediaObjectTypes,
} from "@skylark-reference-apps/lib";
import useTranslation from "next-translate/useTranslation";
import {
  SkeletonPage,
  Hero,
  Header,
  StandardThumbnail,
} from "../../components";

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
    type?: GraphQLMediaObjectTypes;
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

export const CollectionPage: React.FC<Props> = ({
  loading,
  bgImage,
  title,
  synopsis,
  releaseDate,
  content,
  rating,
  CollectionItemDataFetcher,
}) => {
  const { lang } = useTranslation("common");

  return (
    <div className="mb-20 mt-48 flex min-h-screen w-full flex-col items-center bg-gray-900 font-body">
      <SkeletonPage show={!!loading}>
        <div className="-mt-48"></div>
        <Hero bgImage={bgImage}>
          <Header
            description={synopsis}
            numberOfItems={content.length || 0}
            rating={rating}
            releaseDate={formatReleaseDate(releaseDate, lang)}
            title={title}
            typeOfItems="movie"
          />
        </Hero>
        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-6 px-gutter sm:px-sm-gutter md:grid-cols-3 lg:grid-cols-4 lg:px-lg-gutter xl:px-xl-gutter 2xl:grid-cols-6">
          {content.map(({ self, slug, uid, type }) => (
            <CollectionItemDataFetcher
              key={`collection-content-item-${slug || uid}`}
              self={self}
              slug={slug}
              type={type || "Movie"}
              uid={uid}
            >
              {(item: CollectionPageParsedContentItem) => (
                <StandardThumbnail
                  backgroundImage={item.image}
                  contentLocation="below"
                  description={item.synopsis}
                  duration={item.duration}
                  href={item.href}
                  key={item.uid}
                  releaseDate={formatYear(item.releaseDate)}
                  title={item.title}
                />
              )}
            </CollectionItemDataFetcher>
          ))}
        </div>
      </SkeletonPage>
    </div>
  );
};
