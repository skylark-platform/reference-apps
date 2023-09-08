/**
 * Specs for Sets that are created by the ingestor outside of Airtable
 * (Usually you'd create these through the CMS)
 */
import { SetConfig } from "../lib/interfaces";

const createStreamTVExternalId = (id: string) => `streamtv_${id}`;

const newTVReleases: SetConfig = {
  externalId: createStreamTVExternalId("new_tv_releases"),
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
  slug: "spotlight-movies",
  graphQlSetType: "RAIL_MOVIE",
  contents: [
    { type: "movies", slug: "asteroid-city" },
    { type: "movies", slug: "the-kid-who-would-be-king" },
    { type: "movies", slug: "tenet" },
    { type: "movies", slug: "mank" },
    { type: "movies", slug: "escape-from-pretoria" },
    { type: "movies", slug: "emma" },
    { type: "movies", slug: "cruella" },
    { type: "movies", slug: "the-hustle" },
    { type: "movies", slug: "1917" },
    { type: "movies", slug: "anna" },
    { type: "movies", slug: "once-upon-a-time-in-hollywood" },
    { type: "movies", slug: "ava" },
  ],
};

const bestPictureMovies2020: SetConfig = {
  externalId: createStreamTVExternalId("best_picture_nominees_2020"),
  slug: "best-picture-nominees-2020",
  graphQlSetType: "RAIL_WITH_SYNOPSIS",
  contents: [
    { type: "movies", slug: "once-upon-a-time-in-hollywood" },
    { type: "movies", slug: "1917" },
    { type: "movies", slug: "parasite" },
    { type: "movies", slug: "jojo-rabbit" },
    { type: "movies", slug: "little-women" },
    { type: "movies", slug: "the-irishman" },
    { type: "movies", slug: "marriage-story" },
  ],
};

const bestPictureMovies2021: SetConfig = {
  externalId: createStreamTVExternalId("best_picture_nominees_2021"),
  slug: "best-picture-nominees-2021",
  graphQlSetType: "RAIL_WITH_SYNOPSIS",
  contents: [
    { type: "movies", slug: "sound-of-metal" },
    { type: "movies", slug: "minari" },
    { type: "movies", slug: "judas-and-the-black-messiah" },
    { type: "movies", slug: "promising-young-woman" },
    { type: "movies", slug: "nomadland" },
    { type: "movies", slug: "the-father" },
    { type: "movies", slug: "mank" },
  ],
};

const classicKidsShows: SetConfig = {
  externalId: createStreamTVExternalId("classic_kids_shows"),
  slug: "classic-kids-shows",
  graphQlSetType: "RAIL",
  contents: [
    { type: "brands", slug: "power-rangers" },
    { type: "brands", slug: "teletubbies" },
    { type: "brands", slug: "chucklevision" },
    { type: "brands", slug: "pokemon" },
  ],
};

const homePageSlider: SetConfig = {
  externalId: createStreamTVExternalId("home_page_slider"),
  slug: "media-reference-home-page-hero",
  graphQlSetType: "SLIDER",
  contents: [
    { type: "brands", slug: "the-last-of-us" },
    { type: "movies", slug: "deadpool-2" },
    { type: "brands", slug: "yellowjackets" },
    { type: "movies", slug: "sing-2" },
    { type: "movies", slug: "us" },
  ],
};

const kidsHomePageSlider: SetConfig = {
  externalId: createStreamTVExternalId("home_page_slider_kids"),
  slug: "media-reference-home-page-hero-kids",
  graphQlSetType: "SLIDER",
  contents: [
    { type: "brands", slug: "miraculous" },
    { type: "brands", slug: "bluey" },
    { type: "brands", slug: "pokemon" },
    { type: "brands", slug: "paw-patrol" },
  ],
};

// Skylark X does not support dynamic objects yet
const tarantinoMoviesCollection: SetConfig = {
  externalId: createStreamTVExternalId("tarantino_movies"),
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

const fastAndFuriousMoviesCollection: SetConfig = {
  externalId: createStreamTVExternalId("fast_and_furious_movies"),
  slug: "fast-and-furious-movies-collection",
  graphQlSetType: "COLLECTION",
  contents: [
    { type: "movies", slug: "the-fast-and-the-furious" },
    { type: "movies", slug: "2-fast-2-furious" },
    { type: "movies", slug: "tokyo-drift" },
    { type: "movies", slug: "fast-and-furious" },
    { type: "movies", slug: "fast-five" },
    { type: "movies", slug: "fast-and-furious-6" },
    { type: "movies", slug: "furious-7" },
    { type: "movies", slug: "the-fate-of-the-furious" },
    { type: "movies", slug: "hobbs-and-shaw" },
    { type: "movies", slug: "f9" },
    { type: "movies", slug: "fast-x" },
  ],
};

const starWarsMoviesCollection: SetConfig = {
  externalId: createStreamTVExternalId("star_wars_skywalker_saga"),
  slug: "star-wars-the-skywalker-saga",
  graphQlSetType: "COLLECTION",
  contents: [
    { type: "movies", slug: "the-phantom-menace" },
    { type: "movies", slug: "attack-of-the-clones" },
    { type: "movies", slug: "revenge-of-the-sith" },
    { type: "movies", slug: "a-new-hope" },
    { type: "movies", slug: "the-empire-strikes-back" },
    { type: "movies", slug: "return-of-the-jedi" },
    { type: "movies", slug: "the-force-awakens" },
    { type: "movies", slug: "the-last-jedi" },
    { type: "movies", slug: "the-rise-of-skywalker" },
  ],
};

const gameOfThronesUniverseSlider: SetConfig = {
  externalId: createStreamTVExternalId("game_of_thrones_universe_slider"),
  slug: "game-of-thrones-universe-slider",
  graphQlSetType: "SLIDER",
  contents: [
    { type: "brands", slug: "house-of-the-dragon" },
    { type: "brands", slug: "game-of-thrones" },
  ],
};

const gotHighestRatedEpisodes: SetConfig = {
  externalId: createStreamTVExternalId("got_highest_rated_episodes"),
  slug: "got-highest-rated-episodes",
  graphQlSetType: "GRID",
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
  slug: "game-of-thrones-universe",
  graphQlSetType: "PAGE",
  contents: [
    { type: "set", slug: gameOfThronesUniverseSlider.slug },
    { type: "seasons", slug: "house-of-the-dragon-s01" },
    { type: "set", slug: gotHighestRatedEpisodes.slug },
    { type: "seasons", slug: "got-s05" },
    { type: "seasons", slug: "got-s04" },
    { type: "seasons", slug: "got-s03" },
    { type: "seasons", slug: "got-s02" },
    { type: "seasons", slug: "got-s01" },
  ],
};

const streamingNowRail: SetConfig = {
  externalId: createStreamTVExternalId("streaming_now"),
  slug: "streaming-now",
  graphQlSetType: "RAIL",
  contents: [
    { type: "live-stream", slug: "tears-of-steel" },
    { type: "live-stream", slug: "asharq-documentary" },
  ],
};

const setInEuropeRail: SetConfig = {
  externalId: createStreamTVExternalId("set_in_europe"),
  slug: "set-in-europe",
  graphQlSetType: "RAIL",
  contents: [
    { type: "movie", slug: "jojo-rabbit" },
    { type: "movie", slug: "the-father" },
    { type: "movie", slug: "emma" },
    { type: "movie", slug: "fantastic-mr-fox" },
    { type: "movie", slug: "cruella" },
    { type: "movie", slug: "inglorious-basterds" },
    { type: "brand", slug: "chucklevision" },
  ],
};

const setInAmericaRail: SetConfig = {
  externalId: createStreamTVExternalId("set_in_america"),
  slug: "set-in-america",
  graphQlSetType: "RAIL",
  contents: [
    { type: "brand", slug: "better-call-saul" },
    { type: "movie", slug: "nomadland" },
    { type: "brand", slug: "the-last-of-us" },
    { type: "movie", slug: "once-upon-a-time-in-hollywood" },
    { type: "movie", slug: "four-rooms" },
    { type: "movie", slug: "asteroid-city" },
    { type: "movie", slug: "pulp-fiction" },
    { type: "movie", slug: "deadpool-2" },
    { type: "movie", slug: "true-romance" },
    { type: "movie", slug: "mank" },
    { type: "movie", slug: "e-t-the-extra-terrestrial" },
    { type: "set", slug: fastAndFuriousMoviesCollection.slug },
  ],
};

const discoverCollectionRail: SetConfig = {
  externalId: createStreamTVExternalId("discover_collection"),
  slug: "discover-collection",
  graphQlSetType: "RAIL_PORTRAIT",
  contents: [
    {
      type: "set",
      slug: tarantinoMoviesCollection.slug,
    },
    {
      type: "set",
      slug: wesAndersonMoviesCollection.slug,
    },
    {
      type: "set",
      slug: gameOfThronesUniversePage.slug,
    },
    {
      type: "set",
      slug: fastAndFuriousMoviesCollection.slug,
    },
    {
      type: "set",
      slug: starWarsMoviesCollection.slug,
    },
  ],
};

const mediaReferenceHomepage: SetConfig = {
  externalId: createStreamTVExternalId("homepage"),
  slug: "media-reference-homepage",
  graphQlSetType: "PAGE",
  contents: [
    { type: "set", slug: homePageSlider.slug },
    { type: "set", slug: kidsHomePageSlider.slug },
    { type: "set", slug: spotlightMovies.slug },
    { type: "set", slug: newTVReleases.slug },
    { type: "set", slug: classicKidsShows.slug },
    { type: "set", slug: bestPictureMovies2021.slug },
    { type: "seasons", slug: "got-s01" },
    { type: "seasons", slug: "miraculous-s05" },
    { type: "set", slug: setInEuropeRail.slug },
    { type: "set", slug: setInAmericaRail.slug },
    { type: "set", slug: streamingNowRail.slug },
    { type: "set", slug: discoverCollectionRail.slug },
  ],
};

export const orderedSetsToCreate = [
  newTVReleases,
  spotlightMovies,
  homePageSlider,
  kidsHomePageSlider,
  classicKidsShows,
  tarantinoMoviesCollection,
  wesAndersonMoviesCollection,
  fastAndFuriousMoviesCollection,
  starWarsMoviesCollection,
  bestPictureMovies2020,
  bestPictureMovies2021,
  streamingNowRail,
  setInEuropeRail,
  setInAmericaRail,
  // got
  gameOfThronesUniverseSlider,
  gotHighestRatedEpisodes,
  gameOfThronesUniversePage,
  // discoverCollection needs the tarantinoMoviesCollection and wesAndersonMoviesCollection and gameOfThronesUniversePage
  discoverCollectionRail,
  // Order matters, pages are last as they include the rails and sliders
  mediaReferenceHomepage,
];
