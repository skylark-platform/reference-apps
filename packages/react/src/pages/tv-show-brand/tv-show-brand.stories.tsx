import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BrandPageParsedEpisode, TVShowBrandPage } from "./tv-show-brand.page";

export default {
  title: "Pages/TVShowBrandPage",
  component: TVShowBrandPage,
} as ComponentMeta<typeof TVShowBrandPage>;

const Template: ComponentStory<typeof TVShowBrandPage> = (args) => (
  <TVShowBrandPage {...args} />
);

const EpisodeDataFetcher: React.FC<{
  slug: string;
  self: string;
  uid: string;
  children(data: BrandPageParsedEpisode): React.ReactNode;
}> = ({ children, slug, uid, self }) => {
  // Using the self to get the episode number into the data fetcher
  const data: BrandPageParsedEpisode = {
    uid,
    slug,
    title: "GOT Episode",
    synopsis: "A description about this episode of Game of Thrones",
    image: `/episodes/GOT - S1 - ${self}.png`,
    href: `/episodes/${self}`,
    number: parseInt(self, 20),
  };

  return <>{children(data)}</>;
};

export const Default = Template.bind({});
Default.args = {
  EpisodeDataFetcher,
  loading: false,
  bgImage: "/heros/got.png",
  title: "Game of Thrones",
  synopsis:
    "In the mythical continent of Westeros, several powerful families fight for control of the Seven Kingdoms. As conflict erupts in the kingdoms of men, an ancient enemy rises once again to threaten them all. Meanwhile, the last heirs of a recently usurped dynasty plot to take back their homeland from across the Narrow Sea.",
  rating: "18",
  releaseDate: "2011-4-17",
  tags: ["Award winning"],
  seasons: Array.from({ length: 4 }, (_, seasonIndex) => ({
    number: seasonIndex + 1,
    episodes: Array.from({ length: 10 }, (__, episodeIndex) => {
      const seaNum = seasonIndex + 1;
      const epNum = episodeIndex + 1;
      const uid = `s${seaNum}e${epNum}`;
      const title = `Episode ${epNum}`;
      return {
        uid,
        self: `${epNum}`,
        slug: uid,
        title,
        number: epNum,
      };
    }),
  })),
};
