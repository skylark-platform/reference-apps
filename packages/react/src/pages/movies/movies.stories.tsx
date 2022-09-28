import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MoviesPage, MoviesPageParsedMovie } from "./movies.page";

export default {
  title: "Pages/MoviesPage",
  component: MoviesPage,
} as ComponentMeta<typeof MoviesPage>;

const Template: ComponentStory<typeof MoviesPage> = (args) => (
  <MoviesPage {...args} />
);

const MovieDataFetcher: React.FC<{
  slug: string;
  self: string;
  children(data: MoviesPageParsedMovie): React.ReactNode;
}> = ({ children, slug, self }) => {
  // Using the self to get the image number into the data fetcher
  const data: MoviesPageParsedMovie = {
    uid: slug,
    slug,
    title: "Blockbuster Movie",
    image: `/movies/Movie ${self}.png`,
    href: `/movies/${slug}`,
    duration: "1hr 53m",
    releaseDate: "2020-12-12",
  };

  return <>{children(data)}</>;
};

export const Default = Template.bind({});
Default.args = {
  MovieDataFetcher,
  loading: false,
  genres: ["Action", "Adventure", "Something", "Else"],
  movies: Array.from({ length: 12 }, (__, index) => {
    const num = index + 1;
    return {
      slug: `Movie ${num}`,
      self: `${num}`,
    };
  }),
};
