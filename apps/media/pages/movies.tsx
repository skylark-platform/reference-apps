import { ReactNode, useState } from "react";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import {
  MoviesPageParsedMovie,
  MoviesPage,
} from "@skylark-reference-apps/react";
import useTranslation from "next-translate/useTranslation";
import {
  getImageSrc,
  getTitleByOrder,
  Movie,
} from "@skylark-reference-apps/lib";
import { useAllMovies } from "../hooks/useMoviesSet";
import { useAllGenres } from "../hooks/useGenres";
import { DataFetcher } from "../components/dataFetcher";

const MovieDataFetcher: React.FC<{
  slug: string;
  self: string;
  children(data: MoviesPageParsedMovie): ReactNode;
}> = ({ slug, self, children }) => (
  <DataFetcher self={self} slug={slug}>
    {(movie: Movie) => (
      <>
        {children({
          title: getTitleByOrder(
            movie?.title,
            ["short", "medium"],
            movie.objectTitle
          ),
          image: getImageSrc(movie.images, "Thumbnail", "300x300"),
          uid: movie.uid,
          href: `/movie/${movie.slug}`,
          releaseDate: movie.releaseDate,
          duration: "1hr 38m",
        })}
      </>
    )}
  </DataFetcher>
);

const Movies: NextPage = () => {
  const [genre, setGenre] = useState("");
  const { genres } = useAllGenres();
  const selectedGenreUid = genres?.find(({ name }) => name === genre);
  const { movies, isLoading, isError } = useAllMovies(
    "movie",
    selectedGenreUid?.uid
  );
  const { t } = useTranslation("common");

  if (isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white">
        <p>{`Error fetching movies`}</p>
        <pre>{isError.message}</pre>
      </div>
    );
  }

  return (
    <>
      <NextSeo title={t("movies")} />
      <MoviesPage
        MovieDataFetcher={MovieDataFetcher}
        genres={genres?.map(({ name }) => name)}
        loading={isLoading}
        movies={movies}
        onGenreChange={setGenre}
      />
    </>
  );
};

export default Movies;
