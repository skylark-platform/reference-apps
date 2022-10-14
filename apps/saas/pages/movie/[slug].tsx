import type { GetServerSideProps, NextPage } from "next";
import { PlaybackPage } from "@skylark-reference-apps/react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useSingleObject } from "../../hooks/useSingleObject";
import { getSeoDataForObject, SeoObjectData } from "../../lib/getPageSeoData";
import {
  convertObjectToName,
  formatGraphQLCredits,
  getFirstRatingValue,
  getGraphQLCreditsByType,
  getGraphQLImageSrc,
  getSynopsisByOrderForGraphQLObject,
  getTitleByOrderForGraphQLObject,
} from "../../lib/utils";
import { ImageType } from "../../types/gql";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const seo = await getSeoDataForObject(
    "Movie",
    context.query.slug as string,
    context.locale || ""
  );

  return {
    props: {
      seo,
    },
  };
};

const MoviePage: NextPage<{ seo: SeoObjectData }> = ({ seo }) => {
  const { query } = useRouter();
  const {
    data: movie,
    isError,
    isNotFound,
  } = useSingleObject("Movie", query?.slug as string);

  if (isNotFound) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white">
        <p>{`Movie not found`}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white">
        <p>{`Error fetching movie: ${(query?.slug as string) || ""}`}</p>
        <p>{isError.message}</p>
      </div>
    );
  }

  const firstBrand =
    (movie?.brands?.objects &&
      movie?.brands?.objects.length > 0 &&
      movie?.brands?.objects[0]) ||
    undefined;

  const brandTitle = getTitleByOrderForGraphQLObject(firstBrand);

  const title = getTitleByOrderForGraphQLObject(movie);
  const synopsis = getSynopsisByOrderForGraphQLObject(movie);

  const asset = movie?.assets?.objects?.[0];
  const playbackUrl = asset?.url || "/mux-video-intro.mp4";

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
          actors: formatGraphQLCredits(
            getGraphQLCreditsByType(movie?.credits?.objects, "Actor")
          ),
          writers: formatGraphQLCredits(
            getGraphQLCreditsByType(movie?.credits?.objects, "Writer")
          ),
          directors: formatGraphQLCredits(
            getGraphQLCreditsByType(movie?.credits?.objects, "Director")
          ),
        }}
        genres={convertObjectToName(movie?.genres)}
        loading={!movie}
        player={{
          assetId: asset?.external_id || asset?.uid || "1",
          poster: getGraphQLImageSrc(movie?.images, ImageType.Poster),
          src: playbackUrl,
          duration: 58, // TODO read this from asset
        }}
        rating={getFirstRatingValue(movie?.ratings)}
        releaseDate={movie?.release_date || ""}
        synopsis={synopsis}
        themes={convertObjectToName(movie?.themes)}
        title={title}
      />
    </>
  );
};

export default MoviePage;
