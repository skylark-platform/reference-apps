import { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Episode } from "../../types/gql";

import { useListObjects } from "../../hooks/useListObjects";
import { LIST_EPISODES } from "../../graphql/queries";
import { useEpisodeListingFromGenre } from "../../hooks/useObjectListingFromGenre";
import { DisplayError } from "../../components/displayError";
import { ListObjectsWithGenreFilter } from "../../components/pages/listWithGenreFilter/listWithGenreFilter.page";

const Episodes: NextPage = () => {
  const { query } = useRouter();
  const genreFromUrl =
    typeof query?.genre?.[0] === "string" ? query.genre?.[0] : null;

  const [activeGenre, setActiveGenre] = useState<{
    uid: string;
    name: string;
  } | null>(null);

  const activeGenreUid = genreFromUrl || activeGenre?.uid || null;

  const unfilteredEpisodes = useListObjects<Episode>(LIST_EPISODES);
  const filteredEpisodesByGenre = useEpisodeListingFromGenre(activeGenreUid);

  const {
    episodes,
    isError: isEpisodeError,
    isLoading,
  } = activeGenreUid
    ? filteredEpisodesByGenre
    : { ...unfilteredEpisodes, episodes: unfilteredEpisodes.objects };

  if (!isLoading && isEpisodeError) {
    return (
      <DisplayError
        error={isEpisodeError}
        notFoundMessage="No Episodes found."
      />
    );
  }

  return (
    <ListObjectsWithGenreFilter
      activeGenre={activeGenre}
      hideGenreSelector={Boolean(genreFromUrl)}
      isLoadingObjects={isLoading}
      objects={episodes || null}
      setActiveGenre={setActiveGenre}
      thumbnailVariant="landscape"
      translationKeys={{
        title: "episodes",
      }}
    />
  );
};

export default Episodes;
