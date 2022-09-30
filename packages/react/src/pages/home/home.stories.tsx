import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { HomePage, HomePageParsedRailItem } from "./home.page";
import { CarouselItem } from "../../components";

export default {
  title: "Pages/HomePage",
  component: HomePage,
} as ComponentMeta<typeof HomePage>;

const Template: ComponentStory<typeof HomePage> = (args) => (
  <HomePage {...args} />
);

const RailItemDataFetcher: React.FC<{
  slug: string;
  self: string;
  children(data: HomePageParsedRailItem): React.ReactNode;
}> = ({ children, slug, self }) => {
  // This mock fetcher uses slug and self to pass things to display in Storybook
  // Self is used as a number
  // Slug is used for the image
  const data: HomePageParsedRailItem = {
    uid: `content-item-${slug}-${self}`,
    slug,
    title: `Object ${slug}`,
    synopsis: "Not quite Pulp Fiction...",
    image: self,
    href: `/object/${self}`,
    number: parseInt(self, 20),
  };

  return <>{children(data)}</>;
};

const SliderDataFetcher: React.FC<{
  self: string;
  children(data: CarouselItem[]): React.ReactNode;
}> = ({ children }) => {
  // Mocked fetcher
  const heros = ["Deadpool", "GOT", "Sing", "Us"];
  const data: CarouselItem[] = Array.from({ length: 4 }, (__, index) => ({
    title: heros[index],
    image: `/heros/${heros[index].toLowerCase()}.png`,
    href: `/movie/${heros[index]}`,
    type: heros[index] === "GOT" ? "brand" : "movie",
    releaseDate: "2010-10-22",
  }));

  return <>{children(data)}</>;
};

const createContentArray = (length: number, images: string[]) =>
  Array.from({ length }, (__, index) => ({
    slug: `${index + 1}`,
    self: images[index],
  }));

export const Default = Template.bind({});
Default.args = {
  loading: false,
  RailItemDataFetcher,
  SliderDataFetcher,
  items: [
    {
      uid: "slider-1",
      type: "slider",
      slug: "slider-1",
      self: "/api/sets/slider-1",
      title: "Carousel",
      content: [],
    },
    {
      uid: "movie-rail-1",
      type: "rail",
      slug: "movie-rail-1",
      self: "/api/sets/movie-rail-1",
      title: "New releases",
      content: createContentArray(
        12,
        Array.from(
          { length: 12 },
          (__, index) => `/movies/Movie ${index + 1}.png`
        )
      ),
    },
    {
      uid: "episode-rail-1",
      type: "rail",
      slug: "episode-rail-1",
      self: "/api/sets/episode-rail-1",
      title: "Game of Thrones",
      content: createContentArray(
        10,
        Array.from(
          { length: 10 },
          (__, index) => `/episodes/GOT - S1 - ${index + 1}.png`
        )
      ),
    },
    {
      uid: "collection-rail-1",
      type: "collection",
      slug: "collection-rail-1",
      self: "/api/sets/collection-rail-1",
      title: "Discover",
      content: createContentArray(5, [
        "/collections/Brand - Tarantino.png",
        "/collections/Brand - Drama.png",
        "/collections/Brand - Football.png",
        "/collections/Brand - Sherlock.png",
        "/collections/Brand - Game of Thrones.png",
      ]),
    },
  ],
};
