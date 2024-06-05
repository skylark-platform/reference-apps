import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { PlaybackPage } from "./playback.page";

export default {
  title: "Pages/PlaybackPage",
  component: PlaybackPage,
} as ComponentMeta<typeof PlaybackPage>;

const Template: ComponentStory<typeof PlaybackPage> = (args) => (
  <PlaybackPage {...args} />
);

export const Episode = Template.bind({});
Episode.args = {
  brand: {
    uid: "1",
    title: "Better Call Saul",
  },
  credits: {
    Actors: {
      formattedCredits: [
        "Bob Odenkirk",
        "Jonathon Banks",
        "Rhea Seehorn",
        "Patrick Fabian",
        "Tony Dalton",
        "Michael Mando",
      ],
      translatedRole: "Actors",
    },
    Writers: {
      formattedCredits: ["Vince Gilligan", "Peter Gould"],
      translatedRole: "Writers",
    },
    Directors: {
      formattedCredits: ["Michael Morris"],
      translatedRole: "Directors",
    },
  },
  genres: ["Action", "Crime", "Drama", "Suspense"],
  number: 1,
  player: {
    assetId: "asset_1",
    poster: "/episodes/better-call-saul-season-6-episode-1.jpeg",
    src: "/mux-video-intro.mp4",
    duration: 10,
  },
  rating: "15",
  releaseDate: "2022-4-18",
  season: {
    number: 6,
  },
  synopsis:
    "Nacho runs for his life. Saul and Kim hatch a plan to mess with Howard. Mike questions his allegiances.",
  themes: ["Good vs evil", "Perseverance"],
  title: "Wine and Roses",
  tags: ["New release", "Most watched this week"],
};

export const Movie = Template.bind({});
Movie.args = {
  credits: {
    Actors: {
      formattedCredits: [
        "Ryan Reynolds",
        "Josh Brolin",
        "Morena Baccarin",
        "Zazie Beetz",
      ],
      translatedRole: "Actors",
    },
    Writers: {
      formattedCredits: ["Rhett Reese", "Paul Wernick"],
      translatedRole: "Writers",
    },
    Directors: {
      formattedCredits: ["Tim Miller"],
      translatedRole: "Directors",
    },
  },
  genres: [
    "Action",
    "Adventure",
    "Comedy",
    "Fantasy",
    "Superhero",
    "Science fiction",
  ],
  player: {
    assetId: "asset_1",
    poster: "/movies/deadpool-2.jpeg",
    src: "/mux-video-intro.mp4",
    duration: 133,
  },
  rating: "15",
  releaseDate: "2016-2-10",
  synopsis:
    "A wisecracking mercenary gets experimented on and becomes immortal but ugly, and sets out to track down the man who ruined his looks.",
  tags: ["New release", "Most watched this week"],
  themes: ["Love", "Perseverance", "Good vs evil", "Sacrifice"],
  title: "Deadpool 2",
};
