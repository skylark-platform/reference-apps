import type { NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import {
  SeoObjectData,
  convertObjectImagesToSeoImages,
} from "../../lib/getPageSeoData";
import {
  convertObjectToName,
  getFirstRatingValue,
  getFurthestAvailabilityEndDate,
  getGraphQLImageSrc,
  getSynopsisByOrderForGraphQLObject,
  getTitleByOrderForGraphQLObject,
  splitAndFormatGraphQLCreditsByInternalTitle,
} from "../../lib/utils";
import { Availability, ImageType, Movie } from "../../types/gql";
import { DisplayError } from "../../components/displayError";
import { useObject } from "../../hooks/useObject";
import { GET_MOVIE } from "../../graphql/queries";
import { PlaybackPage } from "../../components/pages/playback";
import { useSkylarkEnvironment } from "../../hooks/useSkylarkEnvironment";
import { CLIENT_APP_CONFIG } from "../../constants/app";

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const seo = await getSeoDataForObject(
//     "Movie",
//     context.query.slug as string,
//     context.locale || "",
//   );

//   return {
//     props: {
//       seo,
//     },
//   };
// };

const MoviePage: NextPage<{ seo: SeoObjectData }> = ({ seo }) => {
  const { query } = useRouter();

  const { environment, isLoading: isLoadingEnvironment } =
    useSkylarkEnvironment();

  const {
    data: movie,
    isError,
    isLoading,
  } = useObject<Movie>(
    GET_MOVIE(environment?.hasUpdatedSeason),
    query?.slug as string,
    { disabled: isLoadingEnvironment },
  );

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
  const playbackUrl =
    asset?.hls_url || asset?.url || CLIENT_APP_CONFIG.placeholderVideo;

  const availabilityEndDate = getFurthestAvailabilityEndDate(
    movie?.availability?.objects as Availability[] | undefined,
  );

  return (
    <>
      <NextSeo
        description={synopsis || seo?.synopsis || ""}
        openGraph={{
          images:
            convertObjectImagesToSeoImages(movie?.images) ||
            convertObjectImagesToSeoImages(asset?.images) ||
            seo?.images ||
            [],
        }}
        title={title || seo?.title || "Movie"}
      />
      <PlaybackPage
        audienceRating={movie?.audience_rating || undefined}
        availabilityEndDate={availabilityEndDate}
        brand={
          firstBrand
            ? {
                title: brandTitle,
                uid: firstBrand.uid,
              }
            : undefined
        }
        budget={movie?.budget || undefined}
        credits={splitAndFormatGraphQLCreditsByInternalTitle(
          movie?.credits?.objects,
        )}
        genres={convertObjectToName(movie?.genres)}
        loading={!movie}
        player={{
          assetId: asset?.external_id || asset?.uid || "1",
          poster: getGraphQLImageSrc(movie?.images, ImageType.Poster),
          src: playbackUrl,
          provider: asset?.provider || undefined,
          playbackId: asset?.hls_id || asset?.dash_id || undefined,
        }}
        rating={getFirstRatingValue(movie?.ratings)}
        releaseDate={(movie?.release_date as string | undefined) || ""}
        synopsis={synopsis}
        tags={convertObjectToName(movie?.tags)}
        themes={convertObjectToName(movie?.themes)}
        title={title}
        uid={movie?.uid || ""}
      />
    </>
  );
};

export default MoviePage;
