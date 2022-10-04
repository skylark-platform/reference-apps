import type { GetServerSideProps, NextPage } from "next";
import { PlaybackPage } from "@skylark-reference-apps/react";
import {
  getSynopsisByOrder,
  getTitleByOrder,
} from "@skylark-reference-apps/lib";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useSingleObject } from "../../hooks/useSingleObject";
import { getSeoDataForObject, SeoObjectData } from "../../lib/getPageSeoData";
import { convertObjectToName, formatGraphQLCredits, getFirstRatingValue, getGraphQLCreditsByType, getGraphQLImageSrc } from "../../lib/utils";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const seo = await getSeoDataForObject("Movie", context.query.slug as string);

  return {
    props: {
      seo,
    },
  };
};

const MoviePage: NextPage<{ seo: SeoObjectData }> = ({ seo }) => {
  const { query } = useRouter();
  const { data: movie, isError } = useSingleObject(
    "Movie",
    (query?.slug as string) || "recLa35g2nEPBVqKp"
  );

  if (isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white">
        <p>{`Error fetching movie: ${(query?.slug as string) || ""}`}</p>
        <p>{isError.message}</p>
      </div>
    );
  }

  const title = getTitleByOrder({
    short: movie?.title_short || "",
    medium: movie?.title_medium || "",
    long: movie?.title_long || "",
  });

  const firstBrand =
    movie?.brands?.objects &&
    movie?.brands?.objects.length > 0 &&
    movie?.brands?.objects[0];

  const brandTitle = firstBrand
    ? getTitleByOrder({
        short: firstBrand.title_short || "",
        medium: firstBrand.title_medium || "",
        long: firstBrand.title_long || "",
      })
    : "";

  const synopsis = getSynopsisByOrder({
    short: movie?.synopsis_short || "",
    medium: movie?.synopsis_medium || "",
    long: movie?.synopsis_long || "",
  });

  return (
    <>
      <NextSeo
        description={seo.synopsis}
        openGraph={{ images: seo.images }}
        title={title || seo.title}
      />
      <PlaybackPage
        brand={{
          title: brandTitle,
        }}
        credits={{
          actors: formatGraphQLCredits(getGraphQLCreditsByType(movie?.credits?.objects, "Actor")),
          writers: formatGraphQLCredits(getGraphQLCreditsByType(movie?.credits?.objects, "Writer")),
          directors: formatGraphQLCredits(getGraphQLCreditsByType(movie?.credits?.objects, "Director")),
        }}
        genres={convertObjectToName(movie?.genres)}
        loading={!movie}
        player={{
          assetId: "1",
          poster: getGraphQLImageSrc(movie?.images, "Poster"),
          src: "/mux-video-intro.mp4",
          duration: 58, // TODO read this from asset
        }}
        rating={getFirstRatingValue(movie?.ratings)}
        // releaseDate={movie?.releaseDate}
        synopsis={synopsis}
        themes={convertObjectToName(movie?.themes)}
        title={title}
      />
    </>
  );
};

export default MoviePage;
