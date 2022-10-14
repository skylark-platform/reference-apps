import { ReactNode } from "react";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import {
  BrandPageParsedEpisode,
  TVShowBrandPage,
} from "@skylark-reference-apps/react";
import { useSingleObject } from "../../hooks/useSingleObject";
import { Episode, ImageType, Season } from "../../types/gql";
import { MediaObjectFetcher } from "../../components/mediaObjectFetcher";
import { getSeoDataForObject, SeoObjectData } from "../../lib/getPageSeoData";
import {
  getGraphQLImageSrc,
  getSynopsisByOrderForGraphQLObject,
  getTitleByOrderForGraphQLObject,
} from "../../lib/utils";

const EpisodeDataFetcher: React.FC<{
  uid: string;
  children(data: BrandPageParsedEpisode): ReactNode;
}> = ({ uid, children }) => (
  <MediaObjectFetcher type={"Episode"} uid={uid}>
    {(episode: Episode) => (
      <>
        {children({
          title: getTitleByOrderForGraphQLObject(episode, ["short", "medium"]),
          synopsis: getSynopsisByOrderForGraphQLObject(episode, [
            "medium",
            "short",
            "long",
          ]),
          image: getGraphQLImageSrc(episode?.images, ImageType.Thumbnail),
          number: episode?.episode_number as number,
          uid: episode.uid,
          href: `/episode/${episode.uid}`,
        })}
      </>
    )}
  </MediaObjectFetcher>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const seo = await getSeoDataForObject(
    "Brand",
    context.query.slug as string,
    context.locale || ""
  );

  return {
    props: {
      seo,
    },
  };
};

const BrandPage: NextPage<{ seo: SeoObjectData }> = ({ seo }) => {
  const { query } = useRouter();

  const {
    data: brand,
    isError,
    isNotFound,
  } = useSingleObject("Brand", query?.slug as string);

  if (isNotFound) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white">
        <p>{`Brand not found`}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white">
        <p>{`Error fetching brand: ${(query?.slug as string) || ""}`}</p>
        <p>{isError?.message}</p>
      </div>
    );
  }

  const title = getTitleByOrderForGraphQLObject(brand);
  const synopsis = getSynopsisByOrderForGraphQLObject(brand);

  const seasons = brand?.seasons?.objects?.sort((s1, s2) =>
    (s1?.season_number || 0) > (s2?.season_number || 0) ? 1 : -1
  ) as Season[];

  const formattedSeasonsWithEpisodes = seasons?.map((season) => ({
    number: season?.season_number || 0,
    title: getTitleByOrderForGraphQLObject(season),
    episodes:
      season?.episodes?.objects
        ?.sort((ep1, ep2) =>
          (ep1?.episode_number || 0) > (ep2?.episode_number || 0) ? 1 : -1
        )
        .map((episode) => ({
          uid: episode?.uid || "",
          slug: "",
          self: "",
          title: getTitleByOrderForGraphQLObject(episode, [
            "short",
            "medium",
            "long",
          ]),
          number: episode?.episode_number as number,
        })) || [],
  }));

  return (
    <>
      <NextSeo
        description={seo.synopsis}
        openGraph={{ images: seo.images }}
        title={title || seo.title}
      />
      <TVShowBrandPage
        EpisodeDataFetcher={EpisodeDataFetcher}
        bgImage={getGraphQLImageSrc(brand?.images, ImageType.Main)}
        loading={!brand}
        rating={brand?.ratings?.objects?.[0]?.value}
        seasons={formattedSeasonsWithEpisodes || []}
        synopsis={synopsis}
        tags={brand?.tags?.objects?.map((tag) => tag?.name || "") || []}
        title={title}
      />
    </>
  );
};

export default BrandPage;
