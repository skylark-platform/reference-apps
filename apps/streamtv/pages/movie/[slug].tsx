import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { getSeoDataForObject, SeoObjectData } from "../../lib/getPageSeoData";
import {
  convertObjectToName,
  formatGraphQLCredits,
  getFirstRatingValue,
  getFurthestAvailabilityEndDate,
  getGraphQLCreditsByType,
  getGraphQLImageSrc,
  getSynopsisByOrderForGraphQLObject,
  getTitleByOrderForGraphQLObject,
} from "../../lib/utils";
import { Availability, ImageType, Movie } from "../../types/gql";
import { DisplayError } from "../../components/displayError";
import { useObject } from "../../hooks/useObject";
import { GET_MOVIE } from "../../graphql/queries";
import { PlaybackPage } from "../../components/pages/playback";

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
    isLoading,
  } = useObject<Movie>(GET_MOVIE, query?.slug as string);

  if (!isLoading && isError) {
    return (
      <DisplayError
        error={isError}
        notFoundMessage={`Movie "${query?.slug as string}" not found.`}
      />
    );
  }

  const firstBrand =
    (movie?.brands?.objects &&
      movie?.brands?.objects.length > 0 &&
      movie?.brands?.objects[0]) ||
    undefined;

  const brandTitle = getTitleByOrderForGraphQLObject(firstBrand);

  const title = getTitleByOrderForGraphQLObject(movie, [
    "title_short",
    "title",
  ]);
  const synopsis = getSynopsisByOrderForGraphQLObject(movie);

  const asset = movie?.assets?.objects?.[0];
  const playbackUrl = asset?.url || "/mux-video-intro.mp4";

  const availabilityEndDate = getFurthestAvailabilityEndDate(
    movie?.availability?.objects as Availability[] | undefined
  );

  return (
    <>
      <NextSeo
        description={seo.synopsis}
        openGraph={{ images: seo.images }}
        title={title || seo.title}
      />
      <PlaybackPage
        availabilityEndDate={availabilityEndDate}
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
        }}
        rating={getFirstRatingValue(movie?.ratings)}
        releaseDate={(movie?.release_date as string | undefined) || ""}
        synopsis={synopsis}
        tags={convertObjectToName(movie?.tags)}
        themes={convertObjectToName(movie?.themes)}
        title={title}
      />
    </>
  );
};

export default MoviePage;
