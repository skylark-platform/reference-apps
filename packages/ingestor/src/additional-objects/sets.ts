/**
 * Specs for Sets that are created by the ingestor outside of Airtable
 * (Usually you'd create these through the CMS)
 */
import { SetConfig } from "../interfaces";
import { quentinTarantinoMovies } from "./dynamicObjects";

const newTVReleases: SetConfig = {
  title: "New TV Releases",
  slug: "new-tv-releases",
  set_type_slug: "rail",
  title_short: "New TV Releases",
  contents: [
    { type: "brands", slug: "house-of-the-dragon" },
    { type: "brands", slug: "better-call-saul" },
    { type: "brands", slug: "obi-wan-kenobi" },
  ],
};

const spotlightMovies: SetConfig = {
  title: "Spotlight movies",
  slug: "spotlight-movies",
  set_type_slug: "rail",
  title_short: "Spotlight movies",
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
  title: "Home page hero",
  slug: "media-reference-home-page-hero",
  set_type_slug: "slider",
  contents: [
    { type: "brands", slug: "game-of-thrones" },
    { type: "movies", slug: "deadpool-2" },
    { type: "movies", slug: "sing-2" },
    { type: "movies", slug: "us" },
  ],
};

const tarantinoMoviesCollection: SetConfig = {
  title: "Tarantino Movies Collection",
  slug: "tarantino-movies-collection",
  set_type_slug: "collection",
  contents: [{ type: "dynamic-object", name: quentinTarantinoMovies.name }],
};

const discoverCollection: SetConfig = {
  title: "Discover Collection",
  slug: "discover-collection",
  set_type_slug: "collection",
  contents: [
    {
      type: "set",
      set_type: "collection",
      slug: tarantinoMoviesCollection.slug,
    },
  ],
};

const mediaReferenceHomepage: SetConfig = {
  title: "Homepage",
  slug: "media-reference-homepage",
  set_type_slug: "homepage",
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
  // discoverCollection needs the tarantinoMoviesCollection
  discoverCollection,
  // Order matters, homepage is last as it includes the rail and slider
  mediaReferenceHomepage,
];
