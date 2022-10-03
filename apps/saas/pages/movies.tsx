import { ReactNode, useState } from "react";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import {
  MoviesPageParsedMovie,
  MoviesPage,
} from "@skylark-reference-apps/react";
import useTranslation from "next-translate/useTranslation";
import { getTitleByOrder } from "@skylark-reference-apps/lib";
import { useMovieListing } from "../hooks/useMovieListing";
import { MediaObjectFetcher } from "../components/mediaObjectFetcher";
import { Movie } from "../types/gql";

const MovieDataFetcher: React.FC<{
  uid: string;
  children(data: MoviesPageParsedMovie): ReactNode;
}> = ({ uid, children }) => (
  <MediaObjectFetcher type="Movie" uid={uid}>
    {(movie: Movie) => (
      <>
        {children({
          title: getTitleByOrder(
            {
              short: movie.title_short || "",
              medium: movie.title_medium || "",
              long: movie.title_long || "",
            },
            ["short", "medium"]
          ),
          image: movie?.images?.objects?.[0]?.image_url || "",
          uid: movie.uid,
          href: `/movies/${movie.uid}`,
          releaseDate: "",
          duration: "1hr 38m",
        })}
      </>
    )}
  </MediaObjectFetcher>
);

const Movies: NextPage = () => {
  const [genre, setGenre] = useState("");
  const { data, isError, isLoading } = useMovieListing();

  console.log(data, genre);

  // const { genres } = useAllGenres();
  // const selectedGenreUid = genres?.find(({ name }) => name === genre);
  // const { movies, isLoading, isError } = useAllMovies(
  //   "movie",
  //   selectedGenreUid?.uid
  // );
  const { t } = useTranslation("common");

  if (isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white">
        <p>{`Error fetching movies`}</p>
        <p>{isError.message}</p>
      </div>
    );
  }

  return (
    <>
      <NextSeo title={t("movies")} />
      <MoviesPage
        MovieDataFetcher={MovieDataFetcher}
        genres={[]}
        loading={isLoading}
        movies={
          data?.objects?.map((movie) => ({
            self: "",
            slug: "",
            uid: movie?.uid || "",
          })) || []
        }
        onGenreChange={setGenre}
      />
    </>
  );
};

export default Movies;
