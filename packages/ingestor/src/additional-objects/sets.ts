/**
 * Specs for Sets that are created by the ingestor outside of Airtable
 * (Usually you'd create these through the CMS)
 */
import { SetConfig } from "../lib/interfaces";

const createStreamTVExternalId = (id: string) => `streamtv_${id}`;

const newTVReleases: SetConfig = {
  externalId: createStreamTVExternalId("new_tv_releases"),
  title: "New TV Releases",
  slug: "new-tv-releases",
  graphQlSetType: "RAIL",
  contents: [
    { type: "brands", slug: "house-of-the-dragon" },
    { type: "brands", slug: "better-call-saul" },
    { type: "brands", slug: "obi-wan-kenobi" },
  ],
};

const spotlightMovies: SetConfig = {
  externalId: createStreamTVExternalId("spotlight_movies"),
  title: "Spotlight movies",
  slug: "spotlight-movies",
  graphQlSetType: "RAIL_MOVIE",
  contents: [
    { type: "movies", slug: "the-hustle" },
    { type: "movies", slug: "the-kid-who-would-be-king" },
    { type: "movies", slug: "tenet" },
    { type: "movies", slug: "mank" },
    { type: "movies", slug: "escape-from-pretoria" },
    { type: "movies", slug: "emma" },
    { type: "movies", slug: "cruella" },
    { type: "movies", slug: "6-underground" },
    { type: "movies", slug: "1917" },
    { type: "movies", slug: "anna" },
    { type: "movies", slug: "once-upon-a-time-in-hollywood" },
    { type: "movies", slug: "ava" },
  ],
};

const homePageSlider: SetConfig = {
  externalId: createStreamTVExternalId("home_page_slider"),
  title: "Home page hero",
  slug: "media-reference-home-page-hero",
  graphQlSetType: "SLIDER",
  contents: [
    { type: "brands", slug: "game-of-thrones" },
    { type: "movies", slug: "deadpool-2" },
    { type: "movies", slug: "sing-2" },
    { type: "movies", slug: "us" },
  ],
};

// Skylark X does not support dynamic objects yet
const tarantinoMoviesCollection: SetConfig = {
  externalId: createStreamTVExternalId("tarantino_movies"),
  title: "Tarantino Movies Collection",
  slug: "tarantino-movies-collection",
  graphQlSetType: "COLLECTION",
  contents: [
    { type: "movies", slug: "once-upon-a-time-in-hollywood" },
    { type: "movies", slug: "the-hateful-eight" },
    { type: "movies", slug: "jackie-brown" },
    { type: "movies", slug: "pulp-fiction" },
    { type: "movies", slug: "reservoir-dogs" },
    { type: "movies", slug: "kill-bill-vol-1" },
    { type: "movies", slug: "kill-bill-vol-2" },
    { type: "movies", slug: "deathproof" },
    { type: "movies", slug: "planet-terror" },
    { type: "movies", slug: "from-dusk-till-dawn" },
    { type: "movies", slug: "django-unchained" },
    { type: "movies", slug: "four-rooms" },
    { type: "movies", slug: "true-romance" },
    { type: "movies", slug: "inglorious-basterds" },
  ],
};

const wesAndersonMoviesCollection: SetConfig = {
  externalId: createStreamTVExternalId("wes_anderson_movies"),
  title: "Wes Anderson Movies Collection",
  slug: "wes-anderson-movies-collection",
  graphQlSetType: "COLLECTION",
  contents: [
    { type: "movies", slug: "the-grand-budapest-hotel" },
    { type: "movies", slug: "the-french-dispatch" },
    { type: "movies", slug: "moonrise-kingdom" },
    { type: "movies", slug: "fantastic-mr-fox" },
    { type: "movies", slug: "isle-of-dogs" },
  ],
};

const gameOfThronesUniverseSlider: SetConfig = {
  externalId: createStreamTVExternalId("game_of_thrones_universe_slider"),
  title: "Game of Thrones Universe Slider",
  slug: "game-of-thrones-universe-slider",
  graphQlSetType: "SLIDER",
  contents: [
    { type: "brands", slug: "house-of-the-dragon" },
    { type: "brands", slug: "game-of-thrones" },
  ],
};

const gotHighestRatedEpisodesRail: SetConfig = {
  externalId: createStreamTVExternalId("got_highest_rated_episodes"),
  title: "GOT Highest Rated Episodes",
  slug: "got-highest-rated-episodes",
  graphQlSetType: "RAIL_WITH_SYNOPSIS",
  contents: [
    { type: "episodes", slug: "the-rains-of-castamere" },
    { type: "episodes", slug: "hardhome" },
    { type: "episodes", slug: "the-mountain-and-the-viper" },
    { type: "episodes", slug: "the-lion-and-the-rose" },
    { type: "episodes", slug: "the-laws-of-gods-and-men" },
    { type: "episodes", slug: "baelor" },
  ],
};

const gameOfThronesUniversePage: SetConfig = {
  externalId: createStreamTVExternalId("game_of_thrones_universe"),
  title: "Game of Thrones Universe",
  slug: "game-of-thrones-universe",
  graphQlSetType: "PAGE",
  contents: [
    { type: "set", set_type: "slider", slug: gameOfThronesUniverseSlider.slug },
    { type: "seasons", slug: "house-of-the-dragon-s01" },
    { type: "set", set_type: "rail", slug: gotHighestRatedEpisodesRail.slug },
    { type: "seasons", slug: "got-s05" },
    { type: "seasons", slug: "got-s04" },
    { type: "seasons", slug: "got-s03" },
    { type: "seasons", slug: "got-s02" },
    { type: "seasons", slug: "got-s01" },
  ],
};

const discoverCollectionRail: SetConfig = {
  externalId: createStreamTVExternalId("discover_collection"),
  title: "Discover",
  slug: "discover-collection",
  graphQlSetType: "RAIL_PORTRAIT",
  contents: [
    {
      type: "set",
      set_type: "collection",
      slug: tarantinoMoviesCollection.slug,
    },
    {
      type: "set",
      set_type: "collection",
      slug: wesAndersonMoviesCollection.slug,
    },
    {
      type: "set",
      set_type: "page",
      slug: gameOfThronesUniversePage.slug,
    },
  ],
};

const mediaReferenceHomepage: SetConfig = {
  externalId: createStreamTVExternalId("homepage"),
  title: "Homepage",
  slug: "media-reference-homepage",
  graphQlSetType: "PAGE",
  contents: [
    { type: "set", set_type: "slider", slug: homePageSlider.slug },
    { type: "set", set_type: "rail", slug: spotlightMovies.slug },
    { type: "set", set_type: "rail", slug: newTVReleases.slug },
    { type: "seasons", slug: "got-s01" },
    { type: "seasons", slug: "got-s02" },
    { type: "set", set_type: "rail", slug: discoverCollectionRail.slug },
  ],
};

export const orderedSetsToCreate = [
  newTVReleases,
  spotlightMovies,
  homePageSlider,
  tarantinoMoviesCollection,
  wesAndersonMoviesCollection,
  // got
  gameOfThronesUniverseSlider,
  gotHighestRatedEpisodesRail,
  gameOfThronesUniversePage,
  // discoverCollection needs the tarantinoMoviesCollection and wesAndersonMoviesCollection and gameOfThronesUniversePage
  discoverCollectionRail,
  // Order matters, pages are last as they include the rails and sliders
  mediaReferenceHomepage,
];
