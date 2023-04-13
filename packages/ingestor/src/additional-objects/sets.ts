/**
 * Specs for Sets that are created by the ingestor outside of Airtable
 * (Usually you'd create these through the CMS)
 */
import { SetConfig } from "../lib/interfaces";

const createDataSourceId = (id: string) => `ingestor-set-${id}`;

// Data source but for V10 - GraphQL doesn't like "-"
const createStreamTVExternalId = (id: string) => `streamtv_${id}`;

const newTVReleases: SetConfig = {
  dataSourceId: createDataSourceId("new-tv-releases"),
  externalId: createStreamTVExternalId("new_tv_releases"),
  title: "New TV Releases",
  slug: "new-tv-releases",
  set_type_slug: "rail",
  graphQlSetType: "RAIL",
  contents: [
    { type: "brands", slug: "house-of-the-dragon" },
    { type: "brands", slug: "better-call-saul" },
    { type: "brands", slug: "obi-wan-kenobi" },
  ],
};

const spotlightMovies: SetConfig = {
  dataSourceId: createDataSourceId("spotlight-movies"),
  externalId: createStreamTVExternalId("spotlight_movies"),
  title: "Spotlight movies",
  slug: "spotlight-movies",
  set_type_slug: "rail",
  graphQlSetType: "RAIL",
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
  dataSourceId: createDataSourceId("home-page-slider"),
  externalId: createStreamTVExternalId("home_page_slider"),
  title: "Home page hero",
  slug: "media-reference-home-page-hero",
  set_type_slug: "slider",
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
  dataSourceId: createDataSourceId("tarantino-movies"),
  externalId: createStreamTVExternalId("tarantino_movies"),
  title: "Tarantino Movies Collection",
  slug: "tarantino-movies-collection",
  set_type_slug: "collection",
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
  dataSourceId: createDataSourceId("wes-anderson-movies"),
  externalId: createStreamTVExternalId("wes_anderson_movies"),
  title: "Wes Anderson Movies Collection",
  slug: "wes-anderson-movies-collection",
  set_type_slug: "collection",
  graphQlSetType: "COLLECTION",
  contents: [
    { type: "movies", slug: "the-grand-budapest-hotel" },
    { type: "movies", slug: "the-french-dispatch" },
    { type: "movies", slug: "moonrise-kingdom" },
    { type: "movies", slug: "fantastic-mr-fox" },
  ],
};

const discoverCollection: SetConfig = {
  dataSourceId: createDataSourceId("discover-collection"),
  externalId: createStreamTVExternalId("discover_collection"),
  title: "Discover Collection",
  slug: "discover-collection",
  set_type_slug: "collection",
  graphQlSetType: "COLLECTION",
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
  ],
};

const mediaReferenceHomepage: SetConfig = {
  dataSourceId: createDataSourceId("media-reference-homepage"),
  externalId: createStreamTVExternalId("homepage"),
  title: "Homepage",
  slug: "media-reference-homepage",
  set_type_slug: "homepage",
  graphQlSetType: "PAGE",
  contents: [
    { type: "set", set_type: "slider", slug: homePageSlider.slug },
    { type: "set", set_type: "rail", slug: spotlightMovies.slug },
    { type: "set", set_type: "rail", slug: newTVReleases.slug },
    { type: "seasons", slug: "got-s01" },
    { type: "seasons", slug: "got-s02" },
    { type: "set", set_type: "collection", slug: discoverCollection.slug },
  ],
};

export const orderedSetsToCreate = [
  newTVReleases,
  spotlightMovies,
  homePageSlider,
  tarantinoMoviesCollection,
  wesAndersonMoviesCollection,
  // discoverCollection needs the tarantinoMoviesCollection and wesAndersonMoviesCollection
  discoverCollection,
  // Order matters, homepage is last as it includes the rail and slider
  mediaReferenceHomepage,
];
