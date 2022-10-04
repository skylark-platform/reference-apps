import { ReactNode } from "react";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import {
  BrandPageParsedEpisode,
  TVShowBrandPage,
} from "@skylark-reference-apps/react";
import {
  getTitleByOrder,
  getSynopsisByOrder,
} from "@skylark-reference-apps/lib";
import { useSingleObject } from "../../hooks/useSingleObject";
import { Episode, Season } from "../../types/gql";
import { MediaObjectFetcher } from "../../components/mediaObjectFetcher";
import { getSeoDataForObject, SeoObjectData } from "../../lib/getPageSeoData";

const EpisodeDataFetcher: React.FC<{
  uid: string;
  children(data: BrandPageParsedEpisode): ReactNode;
}> = ({ uid, children }) => (
  <MediaObjectFetcher type={"Episode"} uid={uid}>
    {(episode: Episode) => (
      <>
        {children({
          title: getTitleByOrder(
            {
              short: episode?.title_short || "",
              medium: episode?.title_medium || "",
              long: episode?.title_long || "",
            },
            ["short", "medium"]
          ),
          synopsis: getSynopsisByOrder(
            {
              short: episode?.synopsis_short || "",
              medium: episode?.synopsis_medium || "",
              long: episode?.synopsis_long || "",
            },
            ["medium", "short", "long"]
          ),
          image: episode?.images?.objects?.[0]?.image_url || "",
          number: episode?.episode_number as number,
          uid: episode.uid,
          href: `/episode/${episode.uid}`,
        })}
      </>
    )}
  </MediaObjectFetcher>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const seo = await getSeoDataForObject("Brand", context.query.slug as string);

  return {
    props: {
      seo,
    },
  };
};

const BrandPage: NextPage<{ seo: SeoObjectData }> = ({ seo }) => {
  const { query } = useRouter();

  const { data: brand, isError } = useSingleObject(
    "Brand",
    query?.slug as string
  );

  if (isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white">
        <p>{`Error fetching brand: ${(query?.slug as string) || ""}`}</p>
        <p>{isError?.message}</p>
      </div>
    );
  }

  const title = getTitleByOrder({
    short: brand?.title_short || "",
    medium: brand?.title_medium || "",
    long: brand?.title_long || "",
  });

  const synopsis = getSynopsisByOrder({
    short: brand?.synopsis_short || "",
    medium: brand?.synopsis_medium || "",
    long: brand?.synopsis_long || "",
  });

  // eslint-disable-next-line no-underscore-dangle
  const seasons = brand?.seasons?.objects?.sort((s1, s2) =>
    (s1?.season_number || 0) > (s2?.season_number || 0) ? 1 : -1
  ) as Season[];

  const formattedSeasonsWithEpisodes = seasons?.map((season) => ({
    number: season?.season_number || 0,
    episodes:
      season?.episodes?.objects
        ?.sort((ep1, ep2) =>
          (ep1?.episode_number || 0) > (ep2?.episode_number || 0) ? 1 : -1
        )
        .map((episode) => ({
          uid: episode?.uid || "",
          slug: "",
          self: "",
          title: getTitleByOrder({
            short: brand?.title_short || "",
            medium: brand?.title_medium || "",
            long: brand?.title_long || "",
          }),
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
        bgImage={brand?.images?.objects?.[0]?.image_url || ""}
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
