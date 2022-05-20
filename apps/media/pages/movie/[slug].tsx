import type { NextPage } from "next";
import { Player } from "@skylark-reference-apps/react";
import { getImageSrc, Movie } from "@skylark-reference-apps/lib";
import { useRouter } from "next/router";
import { useSingleObjectBySlug } from "../../hooks/useSingleObjectBySlug";

const MoviePage: NextPage = () => {
  const { query } = useRouter();

  const { data } = useSingleObjectBySlug("movie", query?.slug as string);
  const movie = data as Movie | undefined;

  return (
    <div className="flex min-h-screen flex-col items-center justify-start py-2 pt-14 md:pt-64">
      <h1>
        {movie?.title.long || movie?.title?.medium || movie?.title?.short}
      </h1>
      <p>
        {movie?.synopsis.long ||
          movie?.synopsis?.medium ||
          movie?.synopsis?.short}
      </p>
      <p>
        {movie?.credits?.map((credit) => (
          <>
            {credit.isExpanded && (
              <div>
                <p>{credit.character}</p>
                <p>{credit.roleUrl.title}</p>
                <p>{credit.peopleUrl.name}</p>
              </div>
            )}
          </>
        ))}
      </p>
      <Player
        poster={movie?.images && getImageSrc(movie.images, "Thumbnail")}
        src="/mux-video-intro.mp4"
        videoId="1"
        videoTitle={
          (movie?.title.short ||
            movie?.title.medium ||
            movie?.title.long ||
            movie?.objectTitle) as string
        }
      />
    </div>
  );
};

export default MoviePage;
