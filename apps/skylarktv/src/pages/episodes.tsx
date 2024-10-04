import { useState } from "react";
import type { NextPage } from "next";
import { Episode } from "../types/gql";

import { useListObjects } from "../hooks/useListObjects";
import { LIST_EPISODES } from "../graphql/queries";
import { useEpisodeListingFromGenre } from "../hooks/useObjectListingFromGenre";
import { DisplayError } from "../components/displayError";
import { ListObjectsWithGenreFilter } from "../components/pages/listWithGenreFilter/listWithGenreFilter.page";

const Episodes: NextPage = () => {
  const [activeGenre, setActiveGenre] = useState<{
    uid: string;
    name: string;
  } | null>(null);

  const unfilteredEpisodes = useListObjects<Episode>(LIST_EPISODES);
  const filteredEpisodesByGenre = useEpisodeListingFromGenre(
    activeGenre?.uid || null,
  );

  const {
    episodes,
    isError: isEpisodeError,
    isLoading,
  } = activeGenre
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
